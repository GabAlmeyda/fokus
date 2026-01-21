import * as z from 'zod';
import { EntityIdSchema, type EntityIdDTO } from './id.schemas.js';

const HabitBaseSchema = z.object({
  userId: EntityIdSchema,

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

  color: z
    .string("Expected type was 'string'.")
    .regex(
      /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
      "Invalid hexadecimal format provided. Expected format was '#ABC' or '#ABCDEF'.",
    )
    .trim()
    .toLowerCase()
    .default('#15E03B'),

  icon: z
    .string("Expected type was 'string'.")
    .min(1, 'Icon name cannot be less than 1 character.'),
});

type HabitRefinementData = z.infer<ReturnType<typeof HabitBaseSchema.partial>>;
function habitRefinement(data: HabitRefinementData, ctx: z.RefinementCtx) {
  if (!data) return;

  switch (data.type) {
    case 'qualitative':
      if (data.progressImpactValue != null) {
        ctx.addIssue({
          code: 'custom',
          path: ['progressImpactValue'],
          message:
            "In qualitative habits, 'progressImpactValue' must be 'null'.",
        });
      }
      if (data.unitOfMeasure != null) {
        ctx.addIssue({
          code: 'custom',
          path: ['unitOfMeasure'],
          message: "In qualitative habits, 'unitOfMeasure' must be 'null'.",
        });
      }
      break;

    case 'quantitative':
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
      break;

    case undefined:
      break;

    default: {
      const exhaustiveCheck: never = data.type;
      throw new Error(
        `[habit-schema.ts (server)] Unhandled case '${exhaustiveCheck}'`,
      );
    }
  }
}

export const HabitFilterSchema = HabitBaseSchema.pick({
  title: true,
})
  .extend({
    weekDay: HabitBaseSchema.shape.weekDays.element,
  })
  .partial()
  .strict()
  .superRefine(
    (data: z.infer<typeof HabitFilterSchema>, ctx: z.RefinementCtx) => {
      const filledKeys = Object.keys(data).filter(
        (key) =>
          typeof data[key as keyof z.infer<typeof HabitFilterSchema>] !==
          'undefined',
      );
      if (filledKeys.length > 1) {
        const properties = filledKeys.map((k) => `'${k}'`).join(', ');

        ctx.addIssue({
          code: 'custom',
          path: [],
          message: `Filter query can only filter by one property at a time, but mulitple properties were provided: ${properties}`,
        });
      }
    },
  );
export type HabitFilterDTO = z.infer<typeof HabitFilterSchema>;

export const HabitCreateSchema = HabitBaseSchema.extend({
  progressImpactValue: HabitBaseSchema.shape.progressImpactValue.default(null),
  unitOfMeasure: HabitBaseSchema.shape.unitOfMeasure.default(null),
  reminder: HabitBaseSchema.shape.reminder.default(null),
}).superRefine(habitRefinement);
export type HabitCreateDTO = z.infer<typeof HabitCreateSchema>;

export const HabitUpdateSchema = HabitBaseSchema.omit({
  userId: true,
})
  .partial()
  .superRefine(habitRefinement);
export type HabitUpdateDTO = z.infer<typeof HabitUpdateSchema>;

export const HabitCheckSchema = z.object({
  userId: HabitBaseSchema.shape.userId,

  habitId: EntityIdSchema,

  date: z.coerce.date('Invalid date format provided').transform((val) => {
    const date = new Date(val);
    date.setUTCHours(0, 0, 0, 0);
    return date;
  }),
});
export type HabitCheckDTO = z.infer<typeof HabitCheckSchema>;

export type HabitStatsDTO = {
  streak: number;
  bestStreak: number;
  isCompletedToday: boolean;
};
export type HabitResponseDTO = z.infer<typeof HabitBaseSchema> &
  HabitStatsDTO & { id: EntityIdDTO };
