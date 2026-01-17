import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MeebonCrypto } from '@meebon/meebon-crypto';

@Injectable()
export class EncryptionInterceptor implements NestInterceptor {
  private crypto: MeebonCrypto | null = null;

  constructor() {
    const privateKey = process.env.API_PRIVATE_KEY;
    const publicKey = process.env.API_PUBLIC_KEY;

    if (privateKey && publicKey) {
      this.crypto = MeebonCrypto.init({
        privateKeyPem: privateKey,
        publicKeyPem: publicKey,
      });
    } else {
      console.warn(
        'EncryptionInterceptor: API_PRIVATE_KEY or API_PUBLIC_KEY not found. Encryption disabled.',
      );
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // Decrypt Request Body
    if (this.crypto && request.body && request.body.data) {
      try {
        const decrypted = this.crypto.decrypt(request.body.data);
        request.body = JSON.parse(decrypted);
      } catch (e) {
        console.error('Decryption failed:', e);
        // Optional: Throw ForbiddenException or BadRequestException
      }
    }

    return next.handle().pipe(
      map((data) => {
        // Encrypt Response Body
        if (this.crypto && data) {
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
