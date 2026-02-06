import type { ZodError } from 'zod';
import type { HTTPStatusCode } from '../types/http.types.js';
import type { InvalidField } from '../schemas/error-response.schemas.js';

export function formatZodError(error: ZodError): {
  errorType: keyof typeof HTTPStatusCode;
  message: string;
  invalidFields: InvalidField[];
} {
  const isInvalidType = error.issues.some((iss) => iss.code === 'invalid_type');

  const errorType: keyof typeof HTTPStatusCode = isInvalidType
    ? 'BAD_REQUEST'
    : 'UNPROCESSABLE';
  const message = isInvalidType
    ? 'Invalid payload provided.'
    : 'Invalid data provided.';
  const invalidFields: InvalidField[] = error.issues.map((iss) => ({
    field: iss.path.join('.'),
    message: iss.message,
  }));

  return { errorType, message, invalidFields };
}
