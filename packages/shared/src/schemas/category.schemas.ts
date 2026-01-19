import * as z from 'zod';
import { EntityIdSchema, type EntityIdDTO } from './id.schemas.js';

const CategoryBaseSchema = z.object({
  userId: EntityIdSchema,

  name: z
    .string("Expected type was 'string'.")
    .trim()
    .toLowerCase()
    .min(2, 'Name cannot be less than 2 characters.'),
});

export const CategoryFilterSchema = CategoryBaseSchema.pick({
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
export type CategoryFilterDTO = z.infer<typeof CategoryFilterSchema>;

export const CategoryCreateSchema = CategoryBaseSchema;
export type CategoryCreateDTO = z.infer<typeof CategoryCreateSchema>;

export const CategoryUpdateSchema = CategoryBaseSchema.pick({
  name: true,
}).partial();
export type CategoryUpdateDTO = z.infer<typeof CategoryUpdateSchema>;

export type CategoryResponseDTO = z.infer<typeof CategoryBaseSchema> & {
  id: EntityIdDTO;
};
