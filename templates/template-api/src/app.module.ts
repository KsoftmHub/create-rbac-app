import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { EncryptionInterceptor } from './common/interceptors/encryption.interceptor';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: EncryptionInterceptor,
    },
  ],
})
export class AppModule { }
