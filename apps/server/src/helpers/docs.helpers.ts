import { ErrorResponseSchema } from '@fokus/shared';

type DefaultError = {
  description: string;
  content: { 'application/json': { schema: any } }; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export const INVALID_INPUT_ERRORS_DOCS: Record<number, DefaultError> = {
  400: {
    description: 'Invalid data format provided.',
    content: {
      'application/json': {
        schema: ErrorResponseSchema,
      },
    },
  },
  422: {
    description: 'Invalid data content provided.',
    content: {
      'application/json': {
        schema: ErrorResponseSchema,
      },
    },
  },
};

export const DEFAULT_ERRORS_DOCS: Record<number, DefaultError> = {
  401: {
    description: 'Authentication token missing.',
    content: {
      'application/json': {
        schema: ErrorResponseSchema.pick({ message: true }),
      },
    },
  },
  403: {
    description: 'Invalid or expired authentication token.',
    content: {
      'application/json': {
        schema: ErrorResponseSchema.pick({ message: true }),
      },
    },
  },
  500: {
    description: 'Internal server error.',
    content: {
      'application/json': {
        schema: ErrorResponseSchema.pick({ message: true }),
      },
    },
  },
};
