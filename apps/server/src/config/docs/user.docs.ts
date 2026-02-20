import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import {
  ErrorResponseSchema,
  UserLoginSchema,
  UserRegisterSchema,
  UserResponseSchema,
  UserUpdateSchema,
} from '@fokus/shared';
import {
  DEFAULT_ERRORS_DOCS,
  INVALID_INPUT_ERRORS_DOCS,
} from '../../helpers/docs.helpers.js';

export function registerUserDocs(registry: OpenAPIRegistry) {
  // Schemas
  registry.register('UserRegister', UserRegisterSchema);
  registry.register('UserLogin', UserLoginSchema);
  registry.register('UserUpdate', UserUpdateSchema);
  registry.register('UserResponse', UserResponseSchema);

  // Register route
  registry.registerPath({
    tags: ['User'],
    method: 'post',
    path: '/users/auth/register',
    summary: 'Registers a new user.',
    request: {
      body: {
        content: {
          'application/json': { schema: UserRegisterSchema },
        },
      },
    },
    responses: {
      ...INVALID_INPUT_ERRORS_DOCS,
      201: {
        description: 'User registered successfully.',
        content: {
          'application/json': { schema: UserResponseSchema },
        },
      },
      409: {
        description: 'User email is already registered.',
        content: {
          'application/json': { schema: ErrorResponseSchema },
        },
      },
      500: {
        description: 'Internal server error.',
        content: { 'application/json': { schema: ErrorResponseSchema } },
      },
    },
  });

  // Login route
  registry.registerPath({
    tags: ['User'],
    method: 'post',
    path: '/users/auth/login',
    summary: 'Connects a registered user.',
    request: {
      body: {
        content: {
          'application/json': { schema: UserLoginSchema },
        },
      },
    },
    responses: {
      ...INVALID_INPUT_ERRORS_DOCS,
      200: {
        description: 'User logged successfully.',
        content: {
          'application/json': { schema: UserResponseSchema },
        },
      },
      500: {
        description: 'Internal server error.',
        content: { 'application/json': { schema: ErrorResponseSchema } },
      },
    },
  });

  // Refresh route
  registry.registerPath({
    tags: ['User'],
    method: 'post',
    path: '/users/auth/refresh/me',
    security: [{ refreshTokenCookie: [] }],
    summary: 'Refreshes the access token.',
    request: {},
    responses: {
      200: {
        description: 'Token refreshed successfully.',
        content: { 'application/json': { schema: UserResponseSchema } },
      },
      401: {
        description:
          'The token was refreshed within the period of 10 seconds. The current user tokens are valid and must be used.',
        content: { 'application/json': { schema: ErrorResponseSchema } },
      },
      403: {
        description:
          'A revoked token was used and the token family will be invalidated.',
        content: { 'application/json': { schema: ErrorResponseSchema } },
      },
      404: {
        description: 'The refresh token was not found.',
        content: { 'application/json': { schema: ErrorResponseSchema } },
      },
      500: {
        description: 'Internal server error.',
        content: { 'application/json': { schema: ErrorResponseSchema } },
      },
    },
  });

  // Logout route
  registry.registerPath({
    tags: ['User'],
    method: 'post',
    path: '/users/auth/logout/me',
    security: [{ refreshTokenCookie: [] }],
    summary: 'Logs out a user, removing their tokens.',
    request: {},
    responses: {
      200: {
        description: 'User disconnected successfully.',
      },
      500: {
        description: 'Internal server error.',
        content: { 'application/json': { schema: ErrorResponseSchema } },
      },
    },
  });

  // Get by ID route
  registry.registerPath({
    tags: ['User'],
    method: 'get',
    path: '/users/me',
    security: [{ accessTokenCookie: [] }],
    summary: 'Returns a authenticated user by its ID.',
    request: {},
    responses: {
      ...DEFAULT_ERRORS_DOCS,
      200: {
        description: 'User returned successfully.',
        content: {
          'application/json': { schema: UserResponseSchema },
        },
      },
      404: {
        description: 'User not found.',
        content: { 'application/json': { schema: ErrorResponseSchema } },
      },
    },
  });

  // Update route
  registry.registerPath({
    tags: ['User'],
    method: 'patch',
    path: '/users/me',
    security: [{ accessTokenCookie: [] }],
    summary: 'Updates a authenticated user, searching for its ID.',
    request: {
      body: {
        content: { 'application/json': { schema: UserUpdateSchema } },
      },
    },
    responses: {
      ...DEFAULT_ERRORS_DOCS,
      ...INVALID_INPUT_ERRORS_DOCS,
      200: {
        description: 'User updated successfully.',
        content: { 'application/json': { schema: UserResponseSchema } },
      },
      404: {
        description: 'User not found.',
        content: { 'application/json': { schema: ErrorResponseSchema } },
      },
    },
  });

  // Delete route
  registry.registerPath({
    tags: ['User'],
    method: 'delete',
    path: '/users/me',
    security: [{ accessTokenCookie: [] }],
    summary:
      'Deletes a authenticated user and they refresh tokens, searching for its ID.',
    request: {},
    responses: {
      ...DEFAULT_ERRORS_DOCS,
      204: {
        description: 'User deleted successfully.',
      },
      404: {
        description: 'User not found.',
        content: { 'application/json': { schema: ErrorResponseSchema } },
      },
    },
  });
}
