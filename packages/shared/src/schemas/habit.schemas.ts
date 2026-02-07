import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { EntityIdSchema, type EntityIdDTO } from './id.schemas.js';

extendZodWithOpenApi(z);

const HabitBaseSchema = z.object({
  userId: EntityIdSchema.openapi({
    description: 'Owner ID.',
    example: '65f2a1b8c9d0e1f2a3b4c5d6',
  }),

  title: z
    .string("Expected type was 'string'.")
    .min(2, 'Title cannot be less than 2 characters.')
    .trim()
    .openapi({ description: 'Unique habit title.', example: 'Read 15 pages' }),

  type: z
    .enum(['quantitative', 'qualitative'], {
      error: () => ({
        message:
          "Invalid habit type provided. Valid values are 'quantitative' or 'qualitative'.",
      }),
    })
    .openapi({ description: 'Habit type.', example: 'quantitative' }),

  progressImpactValue: z
    .number("Expected type was 'number'.")
    .min(1, 'Minimum value is 1.')
    .openapi({
      description:
        "Value of the goal progress. If 'type' property is setted to \n" +
        "'qualitative', this must be setted to 1.",
      example: 5,
    }),

  unitOfMeasure: z
    .string("Expected type was 'string'.")
    .min(1, 'Unit of measure cannot be less than 1 character.')
    .trim()
    .nullable()
    .openapi({
      description:
        "Unit of measure of the habit progress. If 'type' property is setted \n" +
        "to 'qualitative', this must be setted to 'null'.",
    }),

  weekDays: z
    .array(
      z.enum(['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'], {
        error: () => ({
          message:
            "Invalid week days provided. Valid values are 'seg', 'ter', 'qua', 'qui', 'sex', 'sab' or 'dom'.",
        }),
      }),
    )
    .openapi({
      description: 'Week days to the habit active.',
      example: ['ter', 'sab'],
    }),

  reminder: z
    .string("Expected type was 'string'.")
    .regex(
      /^([01][0-9]|2[0-3]):([0-5][0-9])$/,
      "Invalid reminder format provided. Expected format was 'HH:mm'.",
    )
    .nullable()
    .openapi({
      description: "Optional reminder of the habit, in format 'HH:mm'",
      example: '09:30',
    }),

  color: z
    .string("Expected type was 'string'.")
    .regex(
      /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
      "Invalid hexadecimal format provided. Expected format was '#ABC' or '#ABCDEF'.",
    )
    .trim()
    .toLowerCase()
    .default('#15E03B')
    .openapi({
      description:
        "Background color of the habit, in format '#ABC' or '#ABCDEF'.",
      example: '#a202f0',
      default: '#15E03B',
    }),

  icon: z
    .string("Expected type was 'string'.")
    .min(1, 'Icon name cannot be less than 1 character.'),
});

type HabitRefinementData = z.infer<ReturnType<typeof HabitBaseSchema.partial>>;
function habitRefinement(data: HabitRefinementData, ctx: z.RefinementCtx) {
  if (!data) return;

  switch (data.type) {
    case 'qualitative':
      if (data.progressImpactValue && data.progressImpactValue !== 1) {
        ctx.addIssue({
          code: 'custom',
          path: ['progressImpactValue'],
          message: "In qualitative habits, 'progressImpactValue' must be 1.",
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
      if (data.progressImpactValue && data.progressImpactValue < 1) {
        ctx.addIssue({
          code: 'custom',
          path: ['progressImpactValue'],
          message:
            "In quantitative habits, 'progressImpactValue' must be greater than 0.",
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
    weekDay: HabitBaseSchema.shape.weekDays.element.openapi({
      description: 'Week day used to search for.',
      example: 'ter',
    }),
  })
  .partial()
  .strict()
  .superRefine((data, ctx) => {
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
  })
  .openapi('HabitFilter');
export type HabitFilterDTO = z.infer<typeof HabitFilterSchema>;

export const HabitCreateSchema = HabitBaseSchema.extend({
  progressImpactValue: HabitBaseSchema.shape.progressImpactValue
    .default(0)
    .openapi({ default: 0 }),
  unitOfMeasure: HabitBaseSchema.shape.unitOfMeasure
    .default(null)
    .openapi({ default: 'null' }),
  reminder: HabitBaseSchema.shape.reminder
    .default(null)
    .openapi({ default: 'null' }),
})
  .superRefine(habitRefinement)
  .openapi('habitCreate');
export type HabitCreateDTO = z.infer<typeof HabitCreateSchema>;

export const HabitUpdateSchema = HabitBaseSchema.omit({
  userId: true,
})
  .partial()
  .superRefine(habitRefinement)
  .openapi('HabitUpdate');
export type HabitUpdateDTO = z.infer<typeof HabitUpdateSchema>;

export const HabitCompletionLogSchema = z
  .object({
    habitId: EntityIdSchema,

    date: z.coerce
      .date('Invalid date format provided.')
      .transform((val) => {
        const date = new Date(val);
        date.setUTCHours(0, 0, 0, 0);
        return date;
      })
      .refine(
        (val) => {
          const today = new Date();
          today.setUTCHours(0, 0, 0, 0);

          if (val.getTime() > today.getTime()) return false;

          return true;
        },
        { message: 'Date cannot be in the future.' },
      )
      .openapi({
        description:
          "Date of the check/uncheck. A valid 'Date' \n" +
          " object or a string in format 'YYYY-MM-DD'.",
        example: '2025-11-02',
      }),
  })
  .openapi('HabitCheck');
export type HabitCompletionLogDTO = z.infer<typeof HabitCompletionLogSchema>;

export type HabitStatsDTO = {
  streak: number;
  bestStreak: number;
  isCompletedToday: boolean;
};
export type HabitResponseDTO = z.infer<typeof HabitBaseSchema> &
  HabitStatsDTO & { id: EntityIdDTO };

export const HabitResponseSchema = HabitBaseSchema.extend({
  id: EntityIdSchema.openapi({
    description: 'Goal ID.',
    readOnly: true,
  }),

  streak: z
    .number("Expected type was 'number'")
    .min(0, "'streak' must be greater or equal to 0.")
    .openapi({
      description: 'Current streak days of the habit.',
      example: 17,
      readOnly: true,
    }),

  bestStreak: z
    .number("Expected type was 'number'")
    .min(0, "'bestStreak' must be greater or equal to 0.")
    .openapi({
      description: 'Best streak days of the habit.',
      example: 32,
      readOnly: true,
    }),

  isCompletedToday: z.boolean("Expected type was 'boolean'.").openapi({
    description: 'Indicates if the habit was completed in the day.',
    example: true,
    readOnly: true,
  }),
});
