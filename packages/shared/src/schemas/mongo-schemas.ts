import * as z from 'zod';

export const MongoIdSchema = z
  .string("Expected type for ID was 'string'.")
  .regex(/^[0-9a-zA-Z]{24}$/, 'Invalid ID format provided.');

export type MongoIdDTO = z.infer<typeof MongoIdSchema>;
