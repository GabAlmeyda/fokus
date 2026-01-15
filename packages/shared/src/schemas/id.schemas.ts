import * as z from 'zod';

export const EntityIdSchema = z
  .string("Expected type for ID was 'string'.")
  .regex(/^[0-9a-fA-f]{24}$/, 'Invalid ID format provided.');

export type EntityIdDTO = z.infer<typeof EntityIdSchema>;
