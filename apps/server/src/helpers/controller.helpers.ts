import {
  formatZodError,
  HTTPStatusCode,
  type HTTPErrorResponse,
} from '@fokus/shared';
import { AppServerError } from './errors/app-server.errors.js';
import { ZodError } from 'zod';

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

  //! (DELETE) Remover após confirmar o erro
  console.error(err);
  return {
    statusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    body: { message: 'An unexpected error occurred.', invalidFields: [] },
  };
}
