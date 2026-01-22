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
    habitId: ProgressLogBaseSchema.shape.habitId,

    goalId: ProgressLogBaseSchema.shape.goalId,

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
  .superRefine(
    (data: z.infer<typeof ProgressLogFilterSchema>, ctx: z.RefinementCtx) => {
      if (!data) return;

      if (data.habitId && data.goalId) {
        ctx.addIssue({
          code: 'custom',
          path: ['goalId'],
          message: "Cannot filter by 'goalId' and 'habitId' at the same time.",
        });
      }
    },
  );
export type ProgressLogFilterDTO = z.infer<typeof ProgressLogFilterSchema>;

export const ProgressLogFilterQuerySchema = z
  .object({
    habitId: ProgressLogFilterSchema.shape.habitId,

    goalId: ProgressLogFilterSchema.shape.goalId,

    interval: ProgressLogFilterSchema.shape.period.unwrap().shape.interval,

    date: ProgressLogFilterSchema.shape.period.unwrap().shape.date,
  })
  .partial()
  .superRefine(
    (
      data: z.infer<typeof ProgressLogFilterQuerySchema>,
      ctx: z.RefinementCtx,
    ) => {
      if (!data) return;

      if (data.habitId && data.goalId) {
        ctx.addIssue({
          code: 'custom',
          path: ['goalId'],
          message: "Cannot filter by 'goalId' and 'habitId' at the same time.",
        });
      }

      if ((!data.date && data.interval) || (data.date && !data.interval)) {
        ctx.addIssue({
          code: 'custom',
          path: ['date'],
          message: "'date' and 'interval' must be provided together.",
        });
      }
    },
  );
export type ProgressLogFilterQueryDTO = z.infer<
  typeof ProgressLogFilterQuerySchema
>;

export const ProgressLogCreateSchema = ProgressLogBaseSchema.extend({
  value: ProgressLogBaseSchema.shape.value.default(1),
}).superRefine(progressLogRefinement);
export type ProgressLogCreateDTO = z.infer<typeof ProgressLogCreateSchema>;

export type ProgressLogResponseDTO = z.infer<typeof ProgressLogBaseSchema> & {
  id: EntityIdDTO;
};
