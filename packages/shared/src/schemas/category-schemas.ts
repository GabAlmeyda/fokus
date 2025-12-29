import * as z from 'zod';
import { MongoIdSchema } from './mongo-schemas.js';

export const CreateCategorySchema = z.object({
  userId: MongoIdSchema,

  name: z
    .string("Expected type was 'string'.")
    .min(2, 'Name cannot be less than 2 characters.')
    .trim()
    .toLowerCase(),
});

export const UpdateCategorySchema = CreateCategorySchema.pick({
  name: true,
}).partial();

export const ResponseCategorySchema = CreateCategorySchema.extend({
  id: MongoIdSchema,
});

export type CreateCategoryDTO = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryDTO = z.infer<typeof UpdateCategorySchema>;
export type ResponseCategoryDTO = z.infer<typeof ResponseCategorySchema>;
