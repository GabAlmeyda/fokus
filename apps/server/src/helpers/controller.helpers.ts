import { ZodError } from 'zod';
import type { Response } from 'express';
import { randomUUID } from 'crypto';
import {
  formatZodError,
  HTTPStatusCode,
  type HTTPErrorResponse,
} from '@fokus/shared';
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
  res.cookie('access_token', tokens.accessToken, {
    httpOnly: true,
    sameSite: 'none',
    partitioned: true,
    secure: true,
    maxAge: 1000 * 60 * 15, // 15 minutes
    path: '/',
  });
  res.cookie('refresh_token', tokens.refreshToken, {
    httpOnly: true,
    sameSite: 'none',
    partitioned: true,
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    path: '/users/auth',
  });
  res.cookie('xsrf_token', randomUUID(), {
    httpOnly: false,
    secure: true,
    sameSite: 'none',
    partitioned: true,
    path: '/',
  });
}

export function removeCookies(res: Response) {
  res.clearCookie('access_token', { path: '/' });
  res.clearCookie('refresh_token', { path: '/users/auth' });
  res.clearCookie('xsrf_token', { path: '/' });
}
