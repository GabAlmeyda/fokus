import * as z from 'zod';

export const CreateCategorySchema = z.object({
  userId: z
    .string("Expected type was 'string'.")
    .regex(/^[0-9a-zA-Z]{24}$/, 'Invalid ID format provided.'),

  name: z
    .string("Expected type was 'string'.")
    .min(2, 'Name cannot be less than 2 characters.')
    .trim()
    .toLowerCase(),
});

export const ResponseCategorySchema = CreateCategorySchema.extend({
  id: z
    .string("Expected type was 'string'.")
    .regex(/^[0-9a-zA-Z]{24}$/, 'Invalid ID format provided.'),
});

export type CreateCategoryDTO = z.infer<typeof CreateCategorySchema>;
export type ResponseCategoryDTO = z.infer<typeof ResponseCategorySchema>;
