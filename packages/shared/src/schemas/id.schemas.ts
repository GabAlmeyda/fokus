import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const EntityIdSchema = z
  .string()
  .regex(/^[0-9a-fA-f]{24}$/, 'Formato de ID inválido.')
  .openapi({ description: 'Entity ID.', example: '65f2a1b8c9d0e1f2a3b4c5d6' })
  .openapi('EntityId');
export type EntityIdDTO = z.infer<typeof EntityIdSchema>;
