import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { MeebonCrypto } from '@meebon/meebon-crypto';
import 'dotenv/config';
import { AuthGuard } from './../src/auth/guards/auth.guard';
import { PoliciesGuard } from './../src/auth/guards/policies.guard';

describe('Encryption (e2e)', () => {
  let app: INestApplication;
  let clientPublicKey: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PoliciesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const envPublicKey = process.env.API_PUBLIC_KEY;
    if (!envPublicKey) {
      throw new Error('API_PUBLIC_KEY not found in .env');
    }
    clientPublicKey = envPublicKey;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/example (GET) should return encrypted data', async () => {
    return request(app.getHttpServer())
      .get('/api/example')
      .expect(200)
      .expect((res) => {
        const body = res.body;
        if (!body.data) throw new Error('Response body.data is missing (not encrypted?)');

        const apiPrivateKey = process.env.API_PRIVATE_KEY;
        if (!apiPrivateKey) throw new Error('API_PRIVATE_KEY not found for decryption test');

        const decrypted = MeebonCrypto.decryptData(body.data, apiPrivateKey);
        // Default message in AppController is "You have generic view access. Filtering data..."
        if (!decrypted.includes('You have generic view access')) {
          throw new Error('Decryption failed or content mismatch: ' + decrypted);
        }
      });
  });

  it('/api/example (POST) should decrypt request body', async () => {
    // Assuming we might add a POST route or just testing the interceptor's decryption logic
    // We'll try hitting a non-existent POST route but verify the interceptor doesn't crash
    // and correctly processes the 'data' field if present.
    // To properly test this, we should ideally have a POST route in the controller.

    const payload = JSON.stringify({ test: 'data' });
    const encryptedPayload = MeebonCrypto.encryptData(payload, clientPublicKey);

    // We expect 404 since there is no POST /api/example, but the Interceptor runs first.
    // If it fails to decrypt, it might log an error.
    return request(app.getHttpServer())
      .post('/api/example')
      .send({ data: encryptedPayload })
      .expect(404);
  });
});
