import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export interface JwtPayload {
  sub: string;
  email?: string;
  name?: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtService {
  private readonly logger = new Logger(JwtService.name);
  private readonly secret: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || '';
    if (!this.secret) {
      this.logger.warn('JWT_SECRET is not set — token verification will fail');
    }
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      const payload = jwt.verify(token, this.secret) as JwtPayload;

      if (!payload.sub) {
        throw new UnauthorizedException('Token missing sub claim');
      }

      this.logger.debug(`Token verified for user ${payload.sub}`);
      return payload;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      this.logger.warn('Token verification failed');
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
