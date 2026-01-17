import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MeebonCrypto } from '@meebon/meebon-crypto';

@Injectable()
export class EncryptionInterceptor implements NestInterceptor {
  private crypto: MeebonCrypto;

  constructor() {
    const cleanPem = (pem: string | undefined) => {
      if (!pem) return undefined;
      // Strip quotes and handle escaped newlines
      const clean = pem.replace(/"/g, '').replace(/\\n/g, '\n').trim();

      // Reconstruct PEM to standard formatting (crucial for some parsers)
      const headerMatch = clean.match(/-----BEGIN [^-]+-----/);
      const footerMatch = clean.match(/-----END [^-]+-----/);

      if (!headerMatch || !footerMatch) return clean;

      const header = headerMatch[0];
      const footer = footerMatch[0];
      const base64 = clean.replace(header, '').replace(footer, '').replace(/\s/g, '');
      const formatted = base64.match(/.{1,64}/g)?.join('\n');

      return `${header}\n${formatted}\n${footer}`;
    };

    const privateKey = cleanPem(process.env.API_PRIVATE_KEY);
    const publicKey = cleanPem(process.env.API_PUBLIC_KEY);

    if (privateKey && publicKey) {
      this.crypto = MeebonCrypto.init({
        privateKeyPem: privateKey,
        publicKeyPem: publicKey,
        schema: 'RSA-OAEP',
      });
    } else {
      console.warn(
        'EncryptionInterceptor: API_PRIVATE_KEY or API_PUBLIC_KEY not found. Encryption disabled.',
      );
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const shouldEncryptResponse = request.headers['x-encrypt-response'] === 'true';

    // Decrypt Request Body
    if (this.crypto && request.body && request.body.data) {
      try {
        const decrypted = this.crypto.decrypt(request.body.data);
        request.body = JSON.parse(decrypted);
      } catch (e) {
        console.error('Decryption failed:', e);
      }
    }

    return next.handle().pipe(
      map((data) => {
        // Encrypt Response Body if requested
        if (this.crypto && data && shouldEncryptResponse) {
          try {
            const stringified = JSON.stringify(data);
            const encrypted = this.crypto.encrypt(stringified);
            return { data: encrypted };
          } catch (e) {
            console.error('Encryption failed:', e);
            return data;
          }
        }
        return data;
      }),
    );
  }
}
