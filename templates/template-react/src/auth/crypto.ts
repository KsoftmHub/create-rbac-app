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

/**
 * Encrypts data using the API public key.
 * This is a static method to avoid MeebonCrypto instance initialization in the browser
 * which might throw errors if a private key is missing.
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
 * A wrapper around fetch that automatically encrypts JSON request bodies
 * using the configured API_PUBLIC_KEY.
 */
export async function secureFetch(url: string, options: RequestInit = {}) {
  const newOptions = { ...options };

  newOptions.headers = {
    ...newOptions.headers,
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

  return fetch(url, newOptions);
}
