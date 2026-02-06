import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { EntityIdSchema } from './id.schemas.js';

extendZodWithOpenApi(z);

const CategoryBaseSchema = z.object({
  userId: EntityIdSchema.openapi({
    description: 'Owner ID.',
    example: '65f2a1b8c9d0e1f2a3b4c5d6',
  }),

  name: z
    .string("Expected type was 'string'.")
    .trim()
    .toLowerCase()
    .min(2, 'Name cannot be less than 2 characters.')
    .openapi({ description: 'Unique category name.', example: 'Wellbeing' }),
});

export const CategoryFilterSchema = CategoryBaseSchema.pick({
  name: true,
})
  .partial()
  .strict()
  .superRefine((data, ctx) => {
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
  })
  .openapi('CategoryFilter');
export type CategoryFilterDTO = z.infer<typeof CategoryFilterSchema>;

export const CategoryCreateSchema =
  CategoryBaseSchema.openapi('CategoryCreate');
export type CategoryCreateDTO = z.infer<typeof CategoryCreateSchema>;

export const CategoryUpdateSchema = CategoryBaseSchema.pick({
  name: true,
})
  .partial()
  .openapi('CategoryUpdate');
export type CategoryUpdateDTO = z.infer<typeof CategoryUpdateSchema>;

export const CategoryResponseSchema = CategoryBaseSchema.extend({
  id: EntityIdSchema.openapi({
    description: 'Category ID.',
    example: '65f2a1b8c9d0e1f2a3b4c5d6',
    readOnly: true,
  }),
});
export type CategoryResponseDTO = z.infer<typeof CategoryResponseSchema>;
