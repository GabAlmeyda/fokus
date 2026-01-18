import * as z from 'zod';

import { EntityIdSchema } from './id.schemas.js';

const GoalBaseSchema = z.object({
  userId: EntityIdSchema,

  categoryId: EntityIdSchema.nullable(),

  title: z
    .string("Expected type was 'string'.")
    .min(2, 'Title cannot be less than 2 characters.')
    .trim(),

  type: z.enum(['qualitative', 'quantitative'], {
    error: () => ({
      message:
        "Invalid goal type provided. Valid values are 'quantitative' or 'qualitative'.",
    }),
  }),

  targetValue: z
    .number("Expected type was 'number'.")
    .min(1, 'Minimun value is 1.')
    .nullable(),

  unitOfMeasure: z
    .string("Expected type was 'string'.")
    .min(1, 'Unit of measure cannot be less than 1 character.')
    .trim()
    .nullable(),

  habits: z.array(EntityIdSchema).default([]),

  deadline: z.coerce
    .date('Invalid date format provided.')
    .nullable()
    .transform((val) => {
      if (!val) return val;

      const date = new Date(val);
      date.setUTCHours(0, 0, 0, 0);

      return date;
    }),

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
    .string("Expeted type was 'string'.")
    .min(1, 'Icon name cannot be less than 1 character.'),
});

type GoalRefinementData = z.infer<ReturnType<typeof GoalBaseSchema.partial>>;
function goalRefinement(data: GoalRefinementData, ctx: z.RefinementCtx) {
  if (!data) return;

  // Validation of the relation between 'type', 'targetValue
  // and 'unitOfMeasure'
  switch (data.type) {
    case 'qualitative':
      if (data.targetValue != null) {
        ctx.addIssue({
          code: 'custom',
          path: ['targetValue'],
          message: "In qualitatite goals, 'targetValue' must be 'null'.",
        });
      }
      if (data.unitOfMeasure != null) {
        ctx.addIssue({
          code: 'custom',
          path: ['unitOfMeasure'],
          message: "In qualitatite goals, 'unitOfMeasure' must be 'null'.",
        });
      }
      break;

    case 'quantitative':
      if (!data.targetValue) {
        ctx.addIssue({
          code: 'custom',
          path: ['targetValue'],
          message: "In quantitative goals, 'targetValue' must be provided.",
        });
      }
      if (!data.unitOfMeasure) {
        ctx.addIssue({
          code: 'custom',
          path: ['unitOfMeasure'],
          message: "In quantitative goals, 'unitOfMeasure' must be provided.",
        });
      }
      break;

    case undefined:
      break;

    default: {
      const exhaustiveCheck: never = data.type;
      throw new Error(
        `[goal-schema.ts (server)] Unhandled case '${exhaustiveCheck}'`,
      );
    }
  }

  // Validation of the date
  if (data.deadline) {
    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0);

    if (data.deadline < currentDate) {
      ctx.addIssue({
        code: 'custom',
        path: ['deadline'],
        message: 'Deadline cannot be earlier than the current time.',
      });
    }
  }

  if (data.habits && data.habits.length > 0 && data.type === 'qualitative') {
    ctx.addIssue({
      code: 'custom',
      path: ['habits'],
      message: "In qualitative goals, 'habits' must be empty.",
    });
  }
}

export const GoalFilterSchema = z
  .strictObject({
    title: GoalBaseSchema.shape.title,
    categoryId: z.union([
      z.literal('none', { error: "Expected value was 'none'." }),
      EntityIdSchema,
    ]),
    deadlineType: z.enum(['not-defined', 'has-deadline', 'this-week'], {
      error: () => ({
        message:
          "Invalid deadline type received. Valid value are 'not-defined', 'has-deadline' or 'this-week'.",
      }),
    }),
  })
  .partial()
  .superRefine(
    (data: z.infer<typeof GoalFilterSchema>, ctx: z.RefinementCtx) => {
      const filledKeys = Object.keys(data).filter(
        (key) =>
          typeof data[key as keyof z.infer<typeof GoalFilterSchema>] !==
          'undefined',
      );
      if (filledKeys.length > 1) {
        const properties = filledKeys.map((k) => `'${k}'`).join(', ');

        ctx.addIssue({
          code: 'custom',
          path: [],
          message: `Filter query can only filter by one property at a time, but multiple properties were provided: ${properties}.`,
        });
      }
    },
  );
export type GoalFilterDTO = z.infer<typeof GoalFilterSchema>;

export const GoalCreateSchema = GoalBaseSchema.extend({
  categoryId: GoalBaseSchema.shape.categoryId.default(null),
  targetValue: GoalBaseSchema.shape.targetValue.default(null),
  unitOfMeasure: GoalBaseSchema.shape.unitOfMeasure.default(null),
  deadline: GoalBaseSchema.shape.deadline.default(null),
}).superRefine(goalRefinement);
export type GoalCreateDTO = z.infer<typeof GoalCreateSchema>;

export const GoalUpdateSchema = GoalBaseSchema.omit({ userId: true })
  .partial()
  .superRefine(goalRefinement);
export type GoalUpdateDTO = z.infer<typeof GoalUpdateSchema>;

export const GoalResponseSchema = GoalBaseSchema.extend({
  id: EntityIdSchema,

  isActive: z.boolean("Expected type was 'boolean'.").default(true),
});
export type GoalResponseDTO = z.infer<typeof GoalResponseSchema>;
