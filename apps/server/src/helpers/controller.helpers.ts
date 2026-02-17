import { ZodError } from 'zod';
import type { Response } from 'express';
import { randomUUID } from 'crypto';
import {
  formatZodError,
  HTTPStatusCode,
  type HTTPErrorResponse,
} from '@fokus/shared';
import { env } from '../config/env.config.js';
import { AppServerError } from './errors/app-server.errors.js';

export function formatHTTPErrorResponse(err: unknown): HTTPErrorResponse {
  if (err instanceof AppServerError) {
    return {
      statusCode: HTTPStatusCode[err.errorType],
      body: { message: err.message, invalidFields: err.invalidFields },
    };
  }

  if (err instanceof ZodError) {
    const { errorType, message, invalidFields } = formatZodError(err);
    return {
      statusCode: HTTPStatusCode[errorType],
      body: {
        message,
        invalidFields,
      },
    };
  }

  return {
    statusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    body: { message: 'An unexpected error occurred.', invalidFields: [] },
  };
}

export function setTokens(
  res: Response,
  tokens: { accessToken: string; refreshToken: string },
) {
  const isProduction = env.NODE_ENV === 'production';

  res.cookie('access_token', tokens.accessToken, {
    httpOnly: false,
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction,
    maxAge: 1000 * 5, // 15 minutes
  });
  res.cookie('refresh_token', tokens.refreshToken, {
    httpOnly: false,
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
  res.cookie('XSRF-TOKEN', randomUUID(), {
    httpOnly: false,
    secure: true,
    sameSite: isProduction ? 'none' : 'lax',
  });
}

export function removeCookies(res: Response) {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  res.clearCookie('XSRF-TOKEN');
}
