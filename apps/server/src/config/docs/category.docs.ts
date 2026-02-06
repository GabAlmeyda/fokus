import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import {
  DEFAULT_ERRORS_DOCS,
  INVALID_INPUT_ERRORS_DOCS,
} from '../../helpers/docs.helpers.js';
import {
  CategoryCreateSchema,
  CategoryFilterSchema,
  CategoryResponseSchema,
  CategoryUpdateSchema,
  EntityIdSchema,
  ErrorResponseSchema,
} from '@fokus/shared';

export function registerCategoryDocs(registry: OpenAPIRegistry) {
  // Schemas
  registry.register('CategoryCreate', CategoryCreateSchema);
  registry.register('CategoryFilter', CategoryFilterSchema);
  registry.register('CategoryUpdate', CategoryUpdateSchema);
  registry.register('CategoryResponse', CategoryResponseSchema);

  // Create route
  registry.registerPath({
    tags: ['Category'],
    method: 'post',
    path: '/categories',
    security: [{ accessTokenCookie: [] }],
    summary: 'Creates a category for a authenticated user.',
    request: {
      body: {
        content: { 'application/json': { schema: CategoryCreateSchema } },
      },
    },
    responses: {
      ...DEFAULT_ERRORS_DOCS,
      ...INVALID_INPUT_ERRORS_DOCS,
      201: {
        description: 'Category created successfully.',
        content: { 'application/json': { schema: CategoryResponseSchema } },
      },
      409: {
        description: 'Category with the provided name is already registered.',
        content: { 'application/json': { schema: ErrorResponseSchema } },
      },
    },
  });

  // Find by ID route
  registry.registerPath({
    tags: ['Category'],
    method: 'get',
    path: '/categories/{categoryId}',
    security: [{ accessTokenCookie: [] }],
    summary: 'Returns an authenticated user category by its ID.',
    request: {
      params: z.object({
        categoryId: EntityIdSchema,
      }),
    },
    responses: {
      ...DEFAULT_ERRORS_DOCS,
      ...INVALID_INPUT_ERRORS_DOCS,
      200: {
        description: 'Category returned successfully.',
        content: { 'application/json': { schema: CategoryResponseSchema } },
      },
      404: {
        description: 'Category not found.',
        content: { 'application/json': { schema: ErrorResponseSchema } },
      },
    },
  });

  // Find by filter route
  registry.registerPath({
    tags: ['Category'],
    method: 'get',
    path: '/categories',
    security: [{ accessTokenCookie: [] }],
    summary: 'Returns all authenticated user categories by a filter criteria.',
    request: {
      query: CategoryFilterSchema,
    },
    responses: {
      ...DEFAULT_ERRORS_DOCS,
      ...INVALID_INPUT_ERRORS_DOCS,
      200: {
        description: 'Categories returned successfully.',
        content: {
          'application/json': { schema: z.array(CategoryResponseSchema) },
        },
      },
    },
  });

  // Update route
  registry.registerPath({
    tags: ['Category'],
    method: 'patch',
    path: '/categories/{categoryId}',
    security: [{ accessTokenCookie: [] }],
    summary: 'Updates an authenticated user category, searching for its ID.',
    request: {
      params: z.object({
        categoryId: EntityIdSchema,
      }),
      body: {
        content: { 'application/json': { schema: CategoryUpdateSchema } },
      },
    },
    responses: {
      ...DEFAULT_ERRORS_DOCS,
      ...INVALID_INPUT_ERRORS_DOCS,
      200: {
        description: 'Category updates successfully.',
        content: { 'application/json': { schema: CategoryResponseSchema } },
      },
      404: {
        description: 'Category not found.',
        content: { 'application/json': { schema: ErrorResponseSchema } },
      },
      409: {
        description: 'Category with the provided name is already registered.',
        content: { 'application/json': { schema: ErrorResponseSchema } },
      },
    },
  });

  // Delete route
  registry.registerPath({
    tags: ['Category'],
    method: 'delete',
    path: '/categories/{categoryId}',
    security: [{ accessTokenCookie: [] }],
    summary: 'Deletes an authenticated user category, searching for its ID.',
    request: {
      params: z.object({
        categoryId: EntityIdSchema,
      }),
    },
    responses: {
      ...DEFAULT_ERRORS_DOCS,
      ...INVALID_INPUT_ERRORS_DOCS,
      200: {
        description: 'Category deleted successfully.',
        content: { 'application/json': { schema: CategoryResponseSchema } },
      },
      404: {
        description: 'Category not found.',
        content: { 'application/json': { schema: ErrorResponseSchema } },
      },
    },
  });
}
