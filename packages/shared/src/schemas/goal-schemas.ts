import * as z from 'zod';
import { MongoIdSchema } from './mongo-schemas.js';

const BaseGoalSchema = z.object({
  userId: MongoIdSchema,

  categoryId: MongoIdSchema.nullable(),

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

  habits: z.array(MongoIdSchema).default([]),

  deadline: z.coerce
    .date('Invalid date format provided.')
    .nullable()
    .default(null)
    .transform((val) => {
      if (!val) return null;

      const date = new Date(val);
      date.setUTCHours(0, 0, 0, 0);

      return date;
    }),

  isActive: z.boolean("Expected type was 'boolean'.").default(true),

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

function goalRefinement(
  data: Partial<z.infer<typeof BaseGoalSchema>>,
  ctx: z.RefinementCtx,
) {
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
  }

  // Validation of the date
  if (data.deadline) {
    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0);

    if (data.deadline < currentDate) {
      ctx.addIssue({
        code: 'custom',
        path: ['deadline'],
        message: 'Deadline cannot be ',
      });
    }
  }
}

export const CreateGoalSchema = BaseGoalSchema.superRefine(goalRefinement);

export const ResponseGoalSchema = BaseGoalSchema.extend({
  id: MongoIdSchema,

  currentValue: z
    .number("Expected type was 'number'.")
    .min(0, 'Minimun value is 0.')
    .nullable()
    .default(null),
});

export type CreateGoalDTO = z.infer<typeof CreateGoalSchema>;
export type ResponseGoalDTO = z.infer<typeof ResponseGoalSchema>;
