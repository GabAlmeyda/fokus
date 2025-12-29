import * as z from 'zod';
import { MongoIdSchema } from './mongo-schemas.js';

const BaseHabitSchema = z.object({
  userId: MongoIdSchema,

  title: z
    .string("Expected type was 'string'.")
    .min(2, 'Title cannot be less than 2 characters.')
    .trim(),

  type: z.enum(['quantitative', 'qualitative'], {
    error: () => ({
      message:
        "Invalid habit type provided. Valid values are 'quantitative' or 'qualitative'.",
    }),
  }),

  progressImpactValue: z.number().min(1, 'Minimum value is 1.').nullable(),

  unitOfMeasure: z
    .string("Expected type was 'string'.")
    .min(1, 'Unit of measure cannot be less than 1 character.')
    .trim()
    .nullable(),

  weekDays: z.array(
    z.enum(['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'], {
      error: () => ({
        message:
          "Invalid week days provided. Valid values are 'seg', 'ter', 'qua', 'qui', 'sex', 'sab' or 'dom'.",
      }),
    }),
  ),

  reminder: z
    .string("Expected type was 'string'.")
    .regex(
      /^([01][0-9]|2[0-3]):([0-5][0-9])$/,
      "Invalid reminder format provided. Expected format was 'HH:mm'.",
    )
    .nullable(),

  streak: z
    .number("Expected type was 'number'.")
    .min(0, 'Minimum value is 0.')
    .default(0),

  bestStreak: z
    .number("Expected type was 'number'.")
    .min(0, 'Minimum value is 0.')
    .default(0),

  color: z
    .string("Expected type was 'string'.")
    .regex(
      /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
      "Invalid hexadecimal format provided. Expected format was '#ABC' or '#ABCDEF'.",
    )
    .toLowerCase(),

  icon: z.string("Expected type was 'string'."),
});

export const CreateHabitSchema = BaseHabitSchema.superRefine((data, ctx) => {
  if (data.type === 'qualitative') {
    if (data.progressImpactValue !== null) {
      ctx.addIssue({
        code: 'custom',
        path: ['progressImpactValue'],
        message: "In qualitative habits, 'progressImpactValue' must be 'null'.",
      });
    }
    if (data.unitOfMeasure !== null) {
      ctx.addIssue({
        code: 'custom',
        path: ['unitOfMeasure'],
        message: "In qualitative habitss, 'unitOfMeasure' must be 'null'.",
      });
    }
  }

  if (data.type === 'quantitative') {
    if (!data.progressImpactValue) {
      ctx.addIssue({
        code: 'custom',
        path: ['progressImpactValue'],
        message:
          "In quantitative habits, 'progressImpactValue' must be provided.",
      });
    }
    if (!data.unitOfMeasure) {
      ctx.addIssue({
        code: 'custom',
        path: ['unitOfMeasure'],
        message: "In quantitative habits, 'unitOfMeasure' must be provided.",
      });
    }
  }
});

export const WeekDaySchema = BaseHabitSchema.shape.weekDays.element;

export const ResponseHabitSchema = BaseHabitSchema.extend({
  id: MongoIdSchema,
});

export type WeekDayDTO = z.infer<typeof WeekDaySchema>;
export type CreateHabitDTO = z.infer<typeof CreateHabitSchema>;
export type ResponseHabitDTO = z.infer<typeof ResponseHabitSchema>;
