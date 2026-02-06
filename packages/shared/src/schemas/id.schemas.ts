import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const EntityIdSchema = z
  .string("Expected type for ID was 'string'.")
  .regex(/^[0-9a-fA-f]{24}$/, 'Invalid ID format provided.')
  .openapi({ description: 'Entity ID.', example: '65f2a1b8c9d0e1f2a3b4c5d6' })
  .openapi('EntityId');
export type EntityIdDTO = z.infer<typeof EntityIdSchema>;
