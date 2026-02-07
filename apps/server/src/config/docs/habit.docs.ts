import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import {
  DEFAULT_ERRORS_DOCS,
  INVALID_INPUT_ERRORS_DOCS,
} from '../../helpers/docs.helpers.js';
import {
  EntityIdSchema,
  ErrorResponseSchema,
  HabitCreateSchema,
  HabitFilterSchema,
  HabitCompletionLogSchema,
  HabitResponseSchema,
  HabitUpdateSchema,
} from '@fokus/shared';

export function registerHabitDocs(registry: OpenAPIRegistry) {
  // Schemas
  registry.register('HabitCreate', HabitCreateSchema);
  registry.register('HabitFilter', HabitFilterSchema);
  registry.register('HabitCompletionLogSchema', HabitCompletionLogSchema);
  registry.register('HabitUpdate', HabitUpdateSchema);
  registry.register('HabitResponse', HabitResponseSchema);

  // Create route
  registry.registerPath({
    tags: ['Habit'],
    method: 'post',
    path: '/habits',
    security: [{ accessTokenCookie: [] }],
    summary: 'Creates a habit for an authenticated user.',
    request: {
      body: {
        content: { 'application/json': { schema: HabitCreateSchema } },
      },
    },
    responses: {
      ...DEFAULT_ERRORS_DOCS,
      ...INVALID_INPUT_ERRORS_DOCS,
      201: {
        description: 'Habit created successfully.',
        content: { 'application/json': { schema: HabitResponseSchema } },
      },
      409: {
        description: 'Habit with the provided title is already registered.',
        content: { 'application/json': { schema: ErrorResponseSchema } },
      },
    },
  });

  // Find by ID route
  registry.registerPath({
    tags: ['habit'],
    method: 'get',
    path: '/habits/{habitId}',
    security: [{ accessTokenCookie: [] }],
    summary: 'Returns an authenticated user habit by its ID.',
    request: {
      params: z.object({
        habitId: EntityIdSchema,
      }),
    },
    responses: {
      ...DEFAULT_ERRORS_DOCS,
      ...INVALID_INPUT_ERRORS_DOCS,
      200: {
        description: 'Habit returned successfully.',
        content: { 'application/json': { schema: HabitResponseSchema } },
      },
      404: {
        description: 'habit not found.',
        content: { 'application/json': { schema: ErrorResponseSchema } },
      },
    },
  });

  // Find by filter route
  registry.registerPath({
    tags: ['Habit'],
    method: 'get',
    path: '/habits',
    security: [{ accessTokenCookie: [] }],
    summary: 'Returns all authenticated user habits by a filter criteria.',
    request: {
      query: HabitFilterSchema,
    },
    responses: {
      ...DEFAULT_ERRORS_DOCS,
      ...INVALID_INPUT_ERRORS_DOCS,
      200: {
        description: 'Habits returned successfully.',
        content: {
          'application/json': { schema: z.array(HabitResponseSchema) },
        },
      },
    },
  });

  // Update route
  registry.registerPath({
    tags: ['Habit'],
    method: 'patch',
    path: '/habits/{habitId}',
    security: [{ accessTokenCookie: [] }],
    summary: 'Updates a authenticated user habit, searching by its ID.',
    request: {
      params: z.object({
        habitId: EntityIdSchema,
      }),
      body: {
        content: { 'application/json': { schema: HabitUpdateSchema } },
      },
    },
    responses: {
      ...DEFAULT_ERRORS_DOCS,
      ...INVALID_INPUT_ERRORS_DOCS,
      200: {
        description: 'Habit updated successfully.',
        content: { 'application/json': { schema: HabitResponseSchema } },
      },
      404: {
        description: 'habit not found.',
        content: { 'application/json': { schema: ErrorResponseSchema } },
      },
    },
  });

  // Check route
  registry.registerPath({
    tags: ['Habit'],
    method: 'post',
    path: 'habits/{habitId}',
    security: [{ accessTokenCookie: [] }],
    summary: 'Marks an authenticated user habit as completed.',
    request: {
      params: z.object({
        habitId: HabitCompletionLogSchema.shape.habitId,
      }),
      query: z.object({
        date: HabitCompletionLogSchema.shape.date,
      }),
    },
    responses: {
      ...DEFAULT_ERRORS_DOCS,
      ...INVALID_INPUT_ERRORS_DOCS,
      200: {
        description: 'Habit successfully marked as completed.',
        content: { 'application/json': { schema: HabitResponseSchema } },
      },
      404: {
        description: 'Habit not found.',
        content: { 'application/json': { schema: ErrorResponseSchema } },
      },
      409: {
        description: 'The habit was already marked as completed.',
        content: { 'application/json': { schema: ErrorResponseSchema } },
      },
    },
  });

  // Uncheck route
  registry.registerPath({
    tags: ['Habit'],
    method: 'patch',
    path: '/habits/{habitId}/uncheck',
    security: [{ accessTokenCookie: [] }],
    summary: 'Removes the completion log of an authenticated user habit.',
    request: {
      params: z.object({
        habitId: EntityIdSchema,
      }),
      query: z.object({
        date: HabitCompletionLogSchema.shape.date,
      }),
    },
    responses: {
      ...DEFAULT_ERRORS_DOCS,
      ...INVALID_INPUT_ERRORS_DOCS,
      200: {
        description: 'Habit completion log deleted successfully.',
        content: { 'application/json': { schema: HabitResponseSchema } },
      },
      404: {
        description: 'Habit completion log not found',
        content: { 'application/json': { schema: ErrorResponseSchema } },
      },
    },
  });

  // Delete route
  registry.registerPath({
    tags: ['Habit'],
    method: 'delete',
    path: '/habits/{habitId}',
    security: [{ accessTokenCookie: [] }],
    summary: 'Deletes an authenticated user habit.',
    request: {
      params: z.object({
        habitId: EntityIdSchema,
      }),
    },
    responses: {
      ...DEFAULT_ERRORS_DOCS,
      ...INVALID_INPUT_ERRORS_DOCS,
      200: {
        description: 'Habit deleted successfully.',
      },
      404: {
        description: 'Habit not found.',
        content: { 'application/json': { schema: ErrorResponseSchema } },
      },
    },
  });
}
