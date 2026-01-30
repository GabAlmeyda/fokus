import {
  formatZodError,
  HTTPStatusCode,
  type HTTPErrorResponse,
} from '@fokus/shared';
import { AppServerError } from './errors/app-server.errors.js';
import { ZodError } from 'zod';
import type { Response } from 'express';

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
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('access_token', tokens.accessToken, {
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction,
    maxAge: 1000 * 60 * 15, // 15 minutes
  });
  res.cookie('refresh_token', tokens.refreshToken, {
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    path: '/users/auth/refresh',
  });
}
