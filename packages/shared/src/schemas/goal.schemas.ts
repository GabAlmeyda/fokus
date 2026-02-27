import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { EntityIdSchema } from './id.schemas.js';
import { differenceInDays, startOfDay } from 'date-fns';

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
    .string()
    .min(2, 'Título deve ter no mínimo 2 caracteres.')
    .trim()
    .openapi({ description: 'Unique goal title.', example: 'Running' }),

  type: z
    .enum(['qualitative', 'quantitative'], {
      error: () => ({
        message:
          "Tipo de meta inválido. Valores permitidos são 'qualitative' ou 'quantitative'.",
      }),
    })
    .openapi({ description: 'Goal type.', example: 'quantitative' }),

  targetValue: z
    .number()
    .min(1, 'Valor mínimo para o campo é 1.')
    .openapi({
      description:
        "Target value of the goal. If 'type' property is\n " +
        "set to 'qualitative', this must be 1.",
      example: 50000,
    }),

  unitOfMeasure: z
    .string()
    .min(1, 'Unidade de medida deve ter no mínimo 1 caractere.')
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
    .date()
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
    .string()
    .regex(
      /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
      "Formato hexadecimal inválido. Formatos permitidos são '#ABC' ou '#ABCDEF'.",
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
    .string()
    .min(1, 'Nome do ícone deve ter no mínimo 1 caractere.')
    .openapi({ description: 'Visual icon of the goal.' }),
});

type GoalRefinementData = z.infer<ReturnType<typeof GoalBaseSchema.partial>>;
function goalRefinement(data: GoalRefinementData, ctx: z.RefinementCtx) {
  if (!data) return;

  // Validation of the relation between 'type', 'targetValue'
  // and 'unitOfMeasure'
  switch (data.type) {
    case 'qualitative':
      if (data.targetValue != 1) {
        ctx.addIssue({
          code: 'custom',
          path: ['targetValue'],
          message: 'Metas qualitativas devem ter o valor final sendo 1.',
        });
      }
      if (data.unitOfMeasure != null) {
        ctx.addIssue({
          code: 'custom',
          path: ['unitOfMeasure'],
          message: 'Metas qualitativas não podem ter unidades de medidas.',
        });
      }
      break;

    case 'quantitative':
      if (!data.targetValue) {
        ctx.addIssue({
          code: 'custom',
          path: ['targetValue'],
          message: 'Metas quantitativas precisam de um valor final.',
        });
      }
      if (!data.unitOfMeasure) {
        ctx.addIssue({
          code: 'custom',
          path: ['unitOfMeasure'],
          message: 'Metas quantitativas precisam de uma unidade de medida.',
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
        message: 'Prazo final não pode ser antes do horário atual.',
      });
    }
  }

  if (data.type === 'qualitative' && data.habitId) {
    ctx.addIssue({
      code: 'custom',
      path: ['habitId'],
      message: 'Metas qualitativas não podem ter um hábito relacionado.',
    });
  }

  if (data.type === 'qualitative' && (data.targetValue || 1) > 1) {
    ctx.addIssue({
      code: 'custom',
      path: ['targetValue'],
      message: 'Metas qualitativas devem ter o valor final sendo 1.',
    });
  }
}

export const GoalFilterSchema = z
  .strictObject({
    title: GoalBaseSchema.shape.title,

    categoryId: z.union([z.literal('none'), EntityIdSchema]).openapi({
      description: 'A category ID used to search for.',
      example: '65f2a1b8c9d0e1f2a3b4c5d6',
    }),

    habitId: GoalBaseSchema.shape.habitId.openapi({
      description: 'A habit ID user to search for.',
      example: '65f2a1b8c9d0e1f2a3b4c5d6',
    }),

    deadlineType: z.enum(['not-defined', 'has-deadline', 'this-week']).openapi({
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
        message: `Requisição por filtro pode filtrar por apenas um critério, mas múltiplos foram fornecidos: ${properties}`,
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

export const GoalProgressLogSchema = z.object({
  goalId: EntityIdSchema.openapi({
    description: 'Goal ID',
    example: '65f2a1b8c9d0e1f2a3b4c5d6',
  }),

  date: z.coerce
    .date()
    .transform((val) => {
      const date = val.toISOString().split('T')[0];
      return new Date(date + 'T12:00:00Z');
    })
    .refine(
      (val) => {
        const today = new Date();
        if (differenceInDays(startOfDay(today), startOfDay(val)) > 0) {
          return false;
        }

        return true;
      },
      { message: 'Data não pode ser no futuro.' },
    )
    .openapi({
      description:
        "Date of the progress log, a valid 'Date' object \n " +
        " or a string in format 'YYYY-MM-DD'.",
      example: '2026-12-02',
    }),

  value: z
    .number()
    .min(1, 'Valor mínimo é 1.')
    .openapi({ description: 'The value of the progress.', example: 100 }),

  userId: GoalBaseSchema.shape.userId.openapi({
    description: 'Owner ID',
    example: '65f2a1b8c9d0e1f2a3b4c5d6',
  }),
});
export type GoalProgressLogDTO = z.infer<typeof GoalProgressLogSchema>;

export const GoalResponseSchema = GoalBaseSchema.extend({
  id: EntityIdSchema.openapi({
    description: 'Goal ID.',
    readOnly: true,
  }),

  currentValue: z
    .number()
    .min(0, 'Valor deve ser maior ou igual a 0.')
    .openapi({
      description: 'Current accumulated progress value.',
      example: 5200,
      readOnly: true,
    }),

  isCompleted: z.boolean().openapi({
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
