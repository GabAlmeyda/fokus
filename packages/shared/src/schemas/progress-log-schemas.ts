import * as z from 'zod';
import { EntityIdSchema } from './id-schemas.js';

const ProgressLogBaseSchema = z.object({
  userId: EntityIdSchema,

  habitId: EntityIdSchema.nullable(),

  goalId: EntityIdSchema.nullable(),

  value: z
    .number("Expected type was 'number'.")
    .min(1, "'value' cannot be less than 1."),

  dateString: z
    .string("Expected type was 'string'.")
    .regex(
      /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/,
      "Invalid date format provided. Expected format was 'YYYY-MM-DD'.",
    )
    .refine((val) => !isNaN(Date.parse(val)), {
      error: () => ({ message: 'Invalid calendar date provided.' }),
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
      path: ['habitId', 'goalId'],
      message: "Or 'habitId' or 'goalId' must be provided.",
    });
  }
}

export const ProgressLogCreateSchema = ProgressLogBaseSchema.extend({
  value: ProgressLogBaseSchema.shape.value.default(1),
}).superRefine(progressLogRefinement);
export type ProgressLogCreateDTO = z.infer<typeof ProgressLogCreateSchema>;

export const ProgressLogResponseSchema = ProgressLogBaseSchema.extend({
  id: EntityIdSchema,
});
export type ProgressLogResponseDTO = z.infer<typeof ProgressLogResponseSchema>;
