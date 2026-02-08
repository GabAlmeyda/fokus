import type { ParsedQs } from 'qs';
import type { ErrorResponse } from '../schemas/error-response.schemas.js';

export type HTTPRequest<B> = {
  headers?: Record<string, string | undefined>;
  params?: Record<string, string | undefined>;
  query?: ParsedQs;
  body?: B;
  userId?: string;
  refreshToken?: string;
};

export type HTTPResponse<B> = HTTPSuccessResponse<B> | HTTPErrorResponse;

export type HTTPSuccessResponse<B> = {
  statusCode: (typeof HTTPStatusCode)[keyof typeof HTTPStatusCode];
  body: B;
};

export type HTTPErrorResponse = {
  statusCode: (typeof HTTPStatusCode)[keyof typeof HTTPStatusCode];
  body: ErrorResponse;
};

export const HTTPStatusCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,

  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,

  INTERNAL_SERVER_ERROR: 500,
} as const;
