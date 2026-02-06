import * as z from 'zod';

import { EntityIdSchema, type EntityIdDTO } from './id.schemas.js';

const ProgressLogBaseSchema = z.object({
  userId: EntityIdSchema,
  habitId: EntityIdSchema.nullable(),

  goalId: EntityIdSchema.nullable(),

  value: z
    .number("Expected type was 'number'.")
    .min(1, "'value' cannot be less than 1."),

  date: z.coerce.date('Invalid date format provided.').transform((val) => {
    const date = new Date(val);
    date.setUTCHours(0, 0, 0, 0);
    return date;
  }),
});

type ProgressLogRefinementData = z.infer<
  ReturnType<typeof ProgressLogBaseSchema.partial>
>;
function progressLogRefinement(
  data: ProgressLogRefinementData,
  ctx: z.RefinementCtx,
) {
  if (!data) return;

  if (!data.habitId && !data.goalId) {
    ctx.addIssue({
      code: 'custom',
      path: ['habitId'],
      message: "Either 'habitId' or 'goalId' must be provided.",
    });
  }

  if (data.date) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    if (data.date.getTime() > today.getTime()) {
      ctx.addIssue({
        code: 'custom',
        path: ['date'],
        message: 'Date cannot be in the future.',
      });
    }
  }
}

export const ProgressLogFilterSchema = z
  .object({
    entityId: EntityIdSchema,

    entityType: z.enum(['habitId', 'goalId'], {
      error: () => ({
        message:
          "Invalid value provided. Expected values are 'habitId' or 'goalId'.",
      }),
    }),

    period: z.object({
      interval: z.enum(['daily', 'weekly', 'monthly'], {
        error: () => ({
          message:
            "Invalid date interval type provided. Expected values were 'daily', 'weekly' or 'monthly'.",
        }),
      }),

      date: ProgressLogBaseSchema.shape.date,
    }),
  })
  .partial()
  .superRefine((data, ctx) => {
    if (data.entityId && !data.entityType) {
      ctx.addIssue({
        code: 'custom',
        path: ['entityType'],
        message: "'EntityId' cannot be provided without 'entityType'.'",
      });
    }
  });
export type ProgressLogFilterDTO = z.infer<typeof ProgressLogFilterSchema>;

export const ProgressLogCreateSchema = ProgressLogBaseSchema.extend({
  value: ProgressLogBaseSchema.shape.value.default(1),
}).superRefine(progressLogRefinement);
export type ProgressLogCreateDTO = z.infer<typeof ProgressLogCreateSchema>;

export type ProgressLogResponseDTO = z.infer<typeof ProgressLogBaseSchema> & {
  id: EntityIdDTO;
};
