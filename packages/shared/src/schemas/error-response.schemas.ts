import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const InvalidFieldSchema = z
  .object({
    field: z
      .string()
      .openapi({ description: 'The invalid field', example: 'email' }),
    message: z.string().optional().openapi({
      description: 'The reason of the error if caused by a invalid field.',
      example: 'Invalid email format.',
    }),
  })
  .openapi('InvalidField');
export type InvalidField = z.infer<typeof InvalidFieldSchema>;

export const ErrorResponseSchema = z
  .object({
    message: z.string().openapi({
      description: 'Generic message of the error.',
      example: 'An unexpected error occurred.',
    }),
    invalidFields: z
      .array(InvalidFieldSchema)
      .optional()
      .openapi({
        description: 'All the invalid fields that caused the error.',
        example: [
          { field: 'field_1', message: 'error_message_1.' },
          { field: 'field_2', message: 'error_message_2.' },
        ],
      }),
  })
  .openapi('ErrorResponse');
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
