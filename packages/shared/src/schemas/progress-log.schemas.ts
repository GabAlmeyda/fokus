import * as z from 'zod';
import { differenceInDays, startOfDay } from 'date-fns';

import { EntityIdSchema, type EntityIdDTO } from './id.schemas.js';

const ProgressLogBaseSchema = z.object({
  userId: EntityIdSchema,
  habitId: EntityIdSchema.nullable(),

  goalId: EntityIdSchema.nullable(),

  value: z.number().min(1, 'Valor mínimo deve ser 1.'),

  date: z.coerce.date().transform((val) => {
    const date = val.toISOString().split('T')[0];
    return new Date(date + 'T12:00:00Z');
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
      message: 'Um hábito ou uma meta devem ser relacionadas ao registro.',
    });
  }

  if (data.date) {
    const today = new Date();

    if (differenceInDays(startOfDay(today), startOfDay(data.date)) > 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['date'],
        message: 'Data não pode ser no futuro.',
      });
    }
  }
}

export const ProgressLogFilterSchema = z
  .object({
    entityId: EntityIdSchema,

    entityType: z.enum(['habitId', 'goalId']),

    period: z.object({
      interval: z.enum(['daily', 'weekly', 'monthly']),
      date: ProgressLogBaseSchema.shape.date,
    }),
  })
  .partial()
  .superRefine((data, ctx) => {
    if (data.entityId && !data.entityType) {
      ctx.addIssue({
        code: 'custom',
        path: ['entityType'],
        message:
          'ID da entidade não pode ser fornecida sem o tipo da entidade.',
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
