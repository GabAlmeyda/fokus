import * as z from 'zod';
import { EntityIdSchema } from './id-schemas.js';

const BaseCategorySchema = z.object({
  userId: EntityIdSchema,

  name: z
    .string("Expected type was 'string'.")
    .trim()
    .toLowerCase()
    .min(2, 'Name cannot be less than 2 characters.'),
});

export const CategoryFilterSchema = BaseCategorySchema.pick({
  name: true,
})
  .partial()
  .strict()
  .superRefine(
    (data: z.infer<typeof CategoryFilterSchema>, ctx: z.RefinementCtx) => {
      const properties = Object.keys(data).filter(
        (k) =>
          typeof data[k as keyof z.infer<typeof CategoryFilterSchema>] !==
          'undefined',
      );
      if (properties.length > 1) {
        ctx.addIssue({
          code: 'custom',
          path: [],
          message: `Filter query can only filter by one property at a time, but multiple properties were provided: ${properties}.`,
        });
      }
    },
  );

export const CreateCategorySchema = BaseCategorySchema;

export const UpdateCategorySchema = BaseCategorySchema.pick({
  name: true,
}).partial();

export const ResponseCategorySchema = BaseCategorySchema.extend({
  id: EntityIdSchema,
});

export type CategoryFilterDTO = z.infer<typeof CategoryFilterSchema>;
export type CreateCategoryDTO = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryDTO = z.infer<typeof UpdateCategorySchema>;
export type ResponseCategoryDTO = z.infer<typeof ResponseCategorySchema>;
