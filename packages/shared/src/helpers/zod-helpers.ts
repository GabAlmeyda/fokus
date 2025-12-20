import type { ZodError } from 'zod';
import type { HTTPStatusCode, InvalidField } from '../types/http-types.js';

export function formatZodError(error: ZodError): {
  errorType: keyof typeof HTTPStatusCode;
  message: string;
  invalidFields: InvalidField[];
} {
  const isInvalidType = error.issues.some((iss) => iss.code === 'invalid_type');

  const errorType: keyof typeof HTTPStatusCode = isInvalidType
    ? 'UNPROCESSABLE'
    : 'BAD_REQUEST';
  const message = isInvalidType
    ? 'Invalid data provided.'
    : 'Invalid payload provided.';
  const invalidFields: InvalidField[] = error.issues.map((iss) => ({
    field: iss.path.join(''),
    message: iss.message,
  }));

  return { errorType, message, invalidFields };
}
