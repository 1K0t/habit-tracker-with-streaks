import {
  SetMetadata,
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { FastifyRequest, FastifyReply } from 'fastify';

export interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

const DEFAULT_OPTIONS: RateLimitOptions = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 requests per minute
};

export const RATE_LIMIT_KEY = 'rate_limit';

export function RateLimit(
  options: Partial<RateLimitOptions> = {},
): MethodDecorator {
  const config = { ...DEFAULT_OPTIONS, ...options };
  return SetMetadata(RATE_LIMIT_KEY, config);
}

/**
 * Simple in-memory rate limiting middleware
 * Tracks requests by IP address
 */
@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private requestTracker = new Map<
    string,
    { count: number; resetTime: number }
  >();

  use(req: FastifyRequest, res: FastifyReply, next: () => void): void {
    const ip = this.getClientIp(req);
    const key = `${ip}-${req.url}-${req.method}`;
    const now = Date.now();
    const config = DEFAULT_OPTIONS;

    const record = this.requestTracker.get(key);

    if (record && now < record.resetTime) {
      if (record.count >= config.maxRequests) {
        throw new HttpException(
          `Too many requests. Please try again after ${Math.ceil((record.resetTime - now) / 1000)} seconds.`,
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      record.count++;
    } else {
      this.requestTracker.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      });
    }

    // Cleanup old entries to prevent memory bloat
    if (this.requestTracker.size > 10000) {
      const cutoff = now - 2 * config.windowMs;
      for (const [k, v] of this.requestTracker.entries()) {
        if (v.resetTime < cutoff) {
          this.requestTracker.delete(k);
        }
      }
    }

    next();
  }

  private getClientIp(req: FastifyRequest): string {
    const forwarded = req.headers['x-forwarded-for'];
    const forwardedStr = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    return forwardedStr?.split(',')[0].trim() || req.ip || 'unknown';
  }
}
