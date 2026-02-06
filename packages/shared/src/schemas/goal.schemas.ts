import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { EntityIdSchema } from './id.schemas.js';

extendZodWithOpenApi(z);

const GoalBaseSchema = z.object({
  userId: EntityIdSchema.openapi({
    description: 'Owner ID.',
    example: '65f2a1b8c9d0e1f2a3b4c5d6',
  }),

  categoryId: EntityIdSchema.nullable().openapi({
    description: 'Optional category ID.',
    example: '65f2a1b8c9d0e1f2a3b4c5d6',
  }),

  title: z
    .string("Expected type was 'string'.")
    .min(2, 'Title cannot be less than 2 characters.')
    .trim()
    .openapi({ description: 'Unique goal title.', example: 'Running' }),

  type: z
    .enum(['qualitative', 'quantitative'], {
      error: () => ({
        message:
          "Invalid goal type provided. Valid values are 'quantitative' or 'qualitative'.",
      }),
    })
    .openapi({ description: 'Goal type.', example: 'quantitative' }),

  targetValue: z
    .number("Expected type was 'number'.")
    .min(1, 'Minimun value is 1.')
    .openapi({
      description:
        "Target value of the goal. If 'type' property is\n " +
        "set to 'qualitative', this must be 1.",
      example: 50000,
    }),

  unitOfMeasure: z
    .string("Expected type was 'string'.")
    .min(1, 'Unit of measure cannot be less than 1 character.')
    .trim()
    .nullable()
    .openapi({
      description:
        "Unit of measure for the 'targetValue' property. If \n" +
        "'type' property is set to 'qualitative', this must be 'null'.",
      example: 'Quilometers',
    }),

  habitId: EntityIdSchema.nullable().openapi({
    description:
      'Optional habit ID of the goal. With a setted habit\n' +
      ", the goal is updated automatic based on the 'progressImpactValue' \n" +
      ' property of the setted habit.',
  }),

  deadline: z.coerce
    .date('Invalid date format provided.')
    .nullable()
    .transform((val) => {
      if (!val) return val;

      const date = new Date(val);
      date.setUTCHours(0, 0, 0, 0);

      return date;
    })
    .openapi({
      description:
        "Optional deadline to complete the goal. A valid 'Date' \n" +
        " object or a string in format 'YYYY-MM-DD'.",
      example: '2026-11-02',
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
        "Background color of the goal in format '#ABC' or '#ABCDEF'.",
      example: '#a202f0',
      default: '#15E03B',
    }),

  icon: z
    .string("Expeted type was 'string'.")
    .min(1, 'Icon name cannot be less than 1 character.')
    .openapi({ description: 'Visual icon of the goal.' }),
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

  if (data.type === 'qualitative' && data.habitId) {
    ctx.addIssue({
      code: 'custom',
      path: ['habitId'],
      message: "In qualitative goals, 'habitId' must be 'null'.",
    });
  }

  if (data.type === 'qualitative' && (data.targetValue || 1) > 1) {
    ctx.addIssue({
      code: 'custom',
      path: ['targetValue'],
      message: "In qualitative goals, 'targetValue' mut be 1",
    });
  }
}

export const GoalFilterSchema = z
  .strictObject({
    title: GoalBaseSchema.shape.title,

    categoryId: z
      .union([
        z.literal('none', { error: "Expected value was 'none'." }),
        EntityIdSchema,
      ])
      .openapi({
        description: 'A category ID used to search for.',
        example: '65f2a1b8c9d0e1f2a3b4c5d6',
      }),

    habitId: GoalBaseSchema.shape.habitId.openapi({
      description: 'A habit ID user to search for.',
      example: '65f2a1b8c9d0e1f2a3b4c5d6',
    }),

    deadlineType: z
      .enum(['not-defined', 'has-deadline', 'this-week'], {
        error: () => ({
          message:
            "Invalid deadline type received. Valid value are 'not-defined', 'has-deadline' or 'this-week'.",
        }),
      })
      .openapi({
        description:
          'A deadline type used to search specific goals:\n\n' +
          "- 'not-defined': searchs goals without a set deadline.\n" +
          "- 'has-deadline': searchs goals with a set deadline.\n" +
          "- 'this-week': searchs goals with a deadline expiring within the current week.",
        example: 'this-week',
      }),
  })
  .partial()
  .superRefine((data, ctx) => {
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
  })
  .openapi('GoalFilter');
export type GoalFilterDTO = z.infer<typeof GoalFilterSchema>;

export const GoalCreateSchema = GoalBaseSchema.extend({
  categoryId: GoalBaseSchema.shape.categoryId
    .default(null)
    .openapi({ default: 'null' }),
  habitId: GoalBaseSchema.shape.habitId
    .default(null)
    .openapi({ default: 'null' }),
  targetValue: GoalBaseSchema.shape.targetValue
    .default(1)
    .openapi({ default: 1 }),
  unitOfMeasure: GoalBaseSchema.shape.unitOfMeasure
    .default(null)
    .openapi({ default: 'null' }),
  deadline: GoalBaseSchema.shape.deadline
    .default(null)
    .openapi({ default: 'null' }),
})
  .superRefine(goalRefinement)
  .openapi('GoalCreate');
export type GoalCreateDTO = z.infer<typeof GoalCreateSchema>;

export const GoalUpdateSchema = GoalBaseSchema.omit({ userId: true })
  .partial()
  .superRefine(goalRefinement)
  .openapi('GoalUpdate');
export type GoalUpdateDTO = z.infer<typeof GoalUpdateSchema>;

export const GoalProgressEntrySchema = z.object({
  goalId: EntityIdSchema.openapi({
    description: 'Goal ID',
    example: '65f2a1b8c9d0e1f2a3b4c5d6',
  }),

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
        "Date of the progress entry, a valid 'Date' object \n " +
        " or a string in format 'YYYY-MM-DD'.",
      example: '2026-12-02',
    }),

  value: z
    .number("Expected type was 'number'.")
    .min(1, 'Minimum value is 1.')
    .openapi({ description: 'The value of the progress.', example: 100 }),

  userId: GoalBaseSchema.shape.userId.openapi({
    description: 'Owner ID',
    example: '65f2a1b8c9d0e1f2a3b4c5d6',
  }),
});
export type GoalProgressEntryDTO = z.infer<typeof GoalProgressEntrySchema>;

export const GoalResponseSchema = GoalBaseSchema.extend({
  id: EntityIdSchema.openapi({
    description: 'Goal ID.',
    readOnly: true,
  }),

  currentValue: z
    .number("Expected type was 'number'")
    .min(0, "'currentValue' must be greater or equal than 0.")
    .openapi({
      description: 'Current accumulated progress value.',
      example: 5200,
      readOnly: true,
    }),

  isCompleted: z.boolean("Expected type was 'boolean'").openapi({
    description: 'Indicates if the goal target value has been reached.',
    example: false,
    readOnly: true,
  }),
}).openapi('GoalResponse');
export type GoalResponseDTO = z.infer<typeof GoalResponseSchema>;

export type GoalStatsDTO = Pick<
  GoalResponseDTO,
  'currentValue' | 'isCompleted'
>;
