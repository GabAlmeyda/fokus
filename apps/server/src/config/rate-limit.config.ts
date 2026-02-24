import rateLimit from 'express-rate-limit';
import { HTTPStatusCode } from '@fokus/shared';
import type { AuthRequest } from '../types/express.types.js';
import type { Request } from 'express';

export const REQUESTS_RATE_LIMITER = {
  login: 10,
  register: 10,
  post: 20,
  get: 200,
  patch: 50,
  delete: 50,
  default: 250,
} as const;

export const defaultRateLimiter = rateLimit({
  windowMs: 1000 * 60 * 15, // 15 minutes
  limit: REQUESTS_RATE_LIMITER.default,
  message: {
    statusCode: HTTPStatusCode.TOO_MANY_REQUESTS,
    message: 'Too many requests. Try again later.',
  },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

export function authUserRateLimiter(limit: number) {
  return rateLimit({
    windowMs: 1000 * 60 * 15, // 15 minutes
    limit,
    message: {
      statusCode: HTTPStatusCode.TOO_MANY_REQUESTS,
      message: 'Too many requests. Try again later.',
    },
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    keyGenerator: (req: Request) => (req as AuthRequest).user.id,
  });
}
