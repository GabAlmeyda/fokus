import * as z from 'zod';

export const CreateHabitSchema = z.object({
  userId: z
    .string("Expected type was 'string'.")
    .regex(/^[0-9a-zA-Z]{24}$/, 'Invalid ID format provided.'),

  title: z
    .string("Expected type was 'string'.")
    .min(2, 'Title cannot be less than 2 characters.')
    .trim(),

  type: z.literal(
    ['quantitative', 'qualitative'],
    "Invalid habit type provided. Valid values are 'quantitative' or 'qualitative'.",
  ),

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

export const WeekDaysSchema = CreateHabitSchema.shape.weekDays.element;

export const ResponseHabitSchema = CreateHabitSchema.extend({
  id: z
    .string("Expected type was 'string'.")
    .regex(/^[0-9a-zA-Z]{24}$/, 'Invalid ID format provided.'),
});

export type WeekDay = z.infer<typeof WeekDaysSchema>;
export type CreateHabitDTO = z.infer<typeof CreateHabitSchema>;
export type ResponseHabitDTO = z.infer<typeof ResponseHabitSchema>;
