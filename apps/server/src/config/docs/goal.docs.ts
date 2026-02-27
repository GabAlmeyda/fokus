import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import {
  EntityIdSchema,
  ErrorResponseSchema,
  GoalCreateSchema,
  GoalFilterSchema,
  GoalProgressLogSchema,
  GoalResponseSchema,
  GoalUpdateSchema,
} from '@fokus/shared';
import {
  DEFAULT_ERRORS_DOCS,
  INVALID_INPUT_ERRORS_DOCS,
} from '../../helpers/docs.helpers.js';

export function registerGoalDocs(registry: OpenAPIRegistry) {
  // Schemas
  registry.register('GoalCreate', GoalCreateSchema);
  registry.register('GoalFilter', GoalFilterSchema);
  registry.register('GoalUpdate', GoalUpdateSchema);
  registry.register('GoalResponse', GoalResponseSchema);

  // Add progress log route
  registry.registerPath({
    tags: ['Goal'],
    method: 'post',
    path: '/goals/{goalId}/logs',
    security: [{ accessTokenCookie: [] }],
    summary: 'Adds a goal progress log for an authenticated user.',
    request: {
      params: z.object({
        goalId: EntityIdSchema,
      }),
      body: {
        content: {
          'application/json': {
            schema: GoalProgressLogSchema.pick({ date: true, value: true }),
          },
        },
      },
    },
    responses: {
      ...DEFAULT_ERRORS_DOCS,
      ...INVALID_INPUT_ERRORS_DOCS,
      201: {
        description: 'Progress log added successfully.',
        content: { 'application/json': { schema: GoalResponseSchema } },
      },
      404: {
        description: 'Goal not found.',
        content: { 'application/json': { schema: ErrorResponseSchema } },
      },
      409: {
        description:
          'In case of a qualitative goal, a progress log for it is already registered.',
        content: { 'application/json': { schema: ErrorResponseSchema } },
      },
    },
  });

  // Create route
  registry.registerPath({
    tags: ['Goal'],
    method: 'post',
    path: '/goals',
    security: [{ accessTokenCookie: [] }],
    summary: 'Creates an authenticated user goal.',
    request: {
      body: { content: { 'application/json': { schema: GoalCreateSchema } } },
    },
    responses: {
      ...DEFAULT_ERRORS_DOCS,
      ...INVALID_INPUT_ERRORS_DOCS,
      201: {
        description: 'Goal created successfully.',
        content: { 'application/json': { schema: GoalResponseSchema } },
      },
      409: {
        description: 'A goal with the provided title is already registered.',
        content: { 'application/json': { schema: ErrorResponseSchema } },
      },
    },
  });

  // Find by ID route
  registry.registerPath({
    tags: ['Goal'],
    method: 'get',
    path: '/goals/{goalId}',
    security: [{ accessTokenCookie: [] }],
    summary: 'Returns an authenticated user goal by its ID.',
    request: {
      params: z.object({
        goalId: EntityIdSchema,
      }),
    },
    responses: {
      ...DEFAULT_ERRORS_DOCS,
      ...INVALID_INPUT_ERRORS_DOCS,
      200: {
        description: 'Goal returned successfully.',
        content: { 'application/json': { schema: GoalResponseSchema } },
      },
      404: {
        description: 'Goal not found.',
        content: { 'application/json': { schema: ErrorResponseSchema } },
      },
    },
  });

  // Find by filter route
  registry.registerPath({
    tags: ['Goal'],
    method: 'get',
    path: '/goals',
    security: [{ accessTokenCookie: [] }],
    summary: 'Returns all authenticated user goals by a filter criteria.',
    request: {
      query: GoalFilterSchema,
    },
    responses: {
      ...DEFAULT_ERRORS_DOCS,
      ...INVALID_INPUT_ERRORS_DOCS,
      200: {
        description: 'Goals returned successfully.',
        content: {
          'application/json': { schema: z.array(GoalResponseSchema) },
        },
      },
    },
  });

  // Update route
  registry.registerPath({
    tags: ['Goal'],
    method: 'patch',
    path: '/goals/{goalId}',
    security: [{ accessTokenCookie: [] }],
    summary: 'Updates an authenticated user goal.',
    request: {
      params: z.object({
        goalId: EntityIdSchema,
      }),
      body: { content: { 'application/json': { schema: GoalUpdateSchema } } },
    },
    responses: {
      ...DEFAULT_ERRORS_DOCS,
      ...INVALID_INPUT_ERRORS_DOCS,
      200: {
        description: 'Goal updated successfully.',
        content: { 'application/json': { schema: GoalResponseSchema } },
      },
      404: {
        description: 'Goal not found.',
        content: { 'application/json': { schema: ErrorResponseSchema } },
      },
    },
  });

  // Remove progress log route
  registry.registerPath({
    tags: ['Goal'],
    method: 'delete',
    path: '/goals/logs/{progressLogId}',
    security: [{ accessTokenCookie: [] }],
    summary: 'Removes a goal progress log of an authenticated user.',
    request: {
      params: z.object({
        progressLogId: EntityIdSchema,
      }),
    },
    responses: {
      ...DEFAULT_ERRORS_DOCS,
      ...INVALID_INPUT_ERRORS_DOCS,
      200: {
        description: 'Progress log removed successfully.',
        content: {
          'application/json': {
            schema: z.object({
              updatedGoal: GoalResponseSchema,
              progressLogId: EntityIdSchema,
            }),
          },
        },
      },
      404: {
        description: 'Goal progress log not found.',
        content: { 'application/json': { schema: ErrorResponseSchema } },
      },
    },
  });

  // Delete route
  registry.registerPath({
    tags: ['Goal'],
    method: 'delete',
    path: 'goals/{goalId}',
    security: [{ accessTokenCookie: [] }],
    summary: 'Deletes an authenticated user goal.',
    request: {
      params: z.object({
        goalId: EntityIdSchema,
      }),
    },
    responses: {
      ...DEFAULT_ERRORS_DOCS,
      ...INVALID_INPUT_ERRORS_DOCS,
      200: {
        description: 'Goal deleted successfully.',
      },
      404: {
        description: 'Goal not found.',
        content: { 'application/json': { schema: ErrorResponseSchema } },
      },
    },
  });
}
