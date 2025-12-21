import { HTTPStatusCode, type HTTPErrorResponse } from '@fokus/shared';
import { ServiceError } from './service-errors.js';

export function formatHTTPErrorResponse(err: unknown): HTTPErrorResponse {
  if (err instanceof ServiceError) {
    return {
      statusCode: HTTPStatusCode[err.errorType],
      body: { message: err.message, invalidFields: err.invalidFields },
    };
  }

  return {
    statusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    body: { message: 'An unexpected error occurred.', invalidFields: [] },
  };
}
