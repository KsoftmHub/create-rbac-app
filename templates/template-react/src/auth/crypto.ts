import { MeebonCrypto } from '@meebon/meebon-crypto';

// Public key injected via vite.config.ts define
const publicKey = (process.env as any).VITE_API_PUBLIC_KEY;

const cleanPem = (pem: string | undefined) => {
  if (!pem) return undefined;
  // Strip quotes and handle escaped newlines
  const clean = pem.replace(/"/g, '').replace(/\\n/g, '\n').trim();

  // Reconstruct PEM to standard formatting
  const headerMatch = clean.match(/-----BEGIN [^-]+-----/);
  const footerMatch = clean.match(/-----END [^-]+-----/);

  if (!headerMatch || !footerMatch) return clean;

  const header = headerMatch[0];
  const footer = footerMatch[0];
  const base64 = clean.replace(header, '').replace(footer, '').replace(/\s/g, '');
  const formatted = base64.match(/.{1,64}/g)?.join('\n');

  return `${header}\n${formatted}\n${footer}`;
};

const cleanedKey = cleanPem(publicKey);
const privateKey = (process.env as any).VITE_API_PRIVATE_KEY;
const cleanedPrivateKey = cleanPem(privateKey);

/**
 * Encrypts data using the API public key.
 */
export const encrypt = (data: string) => {
  if (!cleanedKey) return data;
  try {
    return MeebonCrypto.encryptData(data, cleanedKey, 'RSA-OAEP');
  } catch (e) {
    console.error('Encryption failed:', e);
    return data;
  }
};

/**
 * Decrypts data using the private key (for demo purposes).
 */
export const decrypt = (encryptedData: string) => {
  if (!cleanedPrivateKey) return encryptedData;
  try {
    // We create a temporary instance for decryption
    const crypto = MeebonCrypto.init({
      privateKeyPem: cleanedPrivateKey,
      publicKeyPem: cleanedKey || '', // Required by init but not used for decrypting
      schema: 'RSA-OAEP'
    });
    return crypto.decrypt(encryptedData);
  } catch (e) {
    console.error('Decryption failed:', e);
    return encryptedData;
  }
};

/**
 * A wrapper around fetch that automatically encrypts JSON request bodies
 * using the configured API_PUBLIC_KEY.
 */
export async function secureFetch(url: string, options: RequestInit = {}) {
  const newOptions = { ...options };

  newOptions.headers = {
    ...newOptions.headers,
    'x-encrypt-response': 'true'
  } as any;

  // Encrypt request body if it's JSON
  if (cleanedKey && newOptions.body && typeof newOptions.body === 'string') {
    try {
      // Check if it's already a stringified JSON
      JSON.parse(newOptions.body);
      const encrypted = encrypt(newOptions.body);
      newOptions.body = JSON.stringify({ data: encrypted });
      (newOptions.headers as any)['Content-Type'] = 'application/json';
    } catch (e) {
      // Not JSON or already encrypted, leave as is
    }
  }

  const apiPrefix = (process.env as any).VITE_API_URL || 'http://localhost:3000';
  const fullUrl = url.startsWith('http') ? url : `${apiPrefix}${url}`;

  try {
    const response = await fetch(fullUrl, newOptions);

    // Automatically handle encrypted responses if they are in { data: "..." } format
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const json = await response.json();
        if (json && json.data && typeof json.data === 'string' && cleanedPrivateKey) {
          try {
            const decrypted = decrypt(json.data);
            // Return a mock response object that behaves like the original but with decrypted data
            return new Response(decrypted, {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers
            });
          } catch (decErr) {
            console.error('Failed to decrypt response:', decErr);
            // Return dummy response with decrypted failed message
            return new Response(JSON.stringify(json), { status: response.status, headers: response.headers });
          }
        }
        // If not encrypted or no private key, return original-like response
        return new Response(JSON.stringify(json), { status: response.status, headers: response.headers });
      }
    }

    return response;
  } catch (e: any) {
    console.error('Fetch failed:', e);
    const message = e.message || 'Unknown network error';
    throw new Error(`Failed to reach API at ${fullUrl}. Error: ${message}. Ensure backend is running and CORS is configured.`);
  }
}
