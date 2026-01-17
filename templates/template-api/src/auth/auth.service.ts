import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User, ResourceType } from './types';
import { POLICY_HANDLERS, PolicyName } from './policy';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) { }

  async register(username: string, email: string, pass: string) {
    const existingUser = await this.prisma.user.findFirst({
      where: { OR: [{ username }, { email }] }
    });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(pass, 10);
    return this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        roles: {
          connectOrCreate: {
            where: { name: 'User' },
            create: { name: 'User' }
          }
        }
      }
    });
  }

  async login(username: string, pass: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: { roles: { include: { permissions: true } } }
    });

    if (user && (await bcrypt.compare(pass, user.password))) {
      const tokens = await this.generateTokens(user.id, user.username);
      return {
        user: { id: user.id, username: user.username, email: user.email, roles: user.roles },
        ...tokens
      };
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async refreshTokens(refreshToken: string) {
    const savedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: { include: { roles: { include: { permissions: true } } } } }
    });

    if (!savedToken || savedToken.expiresAt < new Date()) {
      if (savedToken) await this.prisma.refreshToken.delete({ where: { id: savedToken.id } });
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const tokens = await this.generateTokens(savedToken.user.id, savedToken.user.username);

    // Rotate refresh token
    await this.prisma.refreshToken.delete({ where: { id: savedToken.id } });

    return {
      user: {
        id: savedToken.user.id,
        username: savedToken.user.username,
        email: savedToken.user.email,
        roles: savedToken.user.roles
      },
      ...tokens
    };
  }

  private async generateTokens(userId: string, username: string) {
    const payload = { sub: userId, username };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt
      }
    });

    return { accessToken, refreshToken };
  }

  async validateUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { roles: { include: { permissions: true } } }
    });
  }

  hasPermission(
    user: any,
    resource: ResourceType,
    action: string,
    data?: any
  ): boolean {
    if (!user || !user.roles) return false;

    return user.roles.some((role) => {
      const permission = role.permissions.find(
        (p) => p.resource === resource && p.action === action
      );

      if (!permission) return false;

      const handler = POLICY_HANDLERS[permission.policy as PolicyName];
      if (!handler) {
        console.warn(`Policy handler "${permission.policy}" not defined.`);
        return false;
      }

      return handler(user, data);
    });
  }
}
