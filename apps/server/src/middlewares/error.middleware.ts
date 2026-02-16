import { HTTPStatusCode } from 'packages/shared/dist/index.js';
import { AppServerError } from '../helpers/errors/app-server.errors.js';
import type { NextFunction, Request, Response } from 'express';

export default function errorMiddleware(
  err: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppServerError) {
    return res.status(HTTPStatusCode[err.errorType]).json({
      message: err.message,
      invalidFields: err.invalidFields,
    });
  }

  console.error('[errorMiddleware.ts (server)] Internal error: ', err);
  return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json({
    message: 'An unexpected error occurred.',
    invalidFields: [],
  });
}
