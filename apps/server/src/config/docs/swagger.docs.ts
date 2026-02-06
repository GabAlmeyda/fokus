import { z } from 'zod';
import {
  extendZodWithOpenApi,
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from '@asteasolutions/zod-to-openapi';
extendZodWithOpenApi(z);
import swaggerUi from 'swagger-ui-express';
import { EntityIdSchema, API_URL } from '@fokus/shared';
import { registerUserDocs } from './user.docs.js';
import { registerCategoryDocs } from './category.docs.js';
import { registerHabitDocs } from './habit.docs.js';
import { registerGoalDocs } from './goal.docs.js';

const registry = new OpenAPIRegistry();
registry.registerComponent('securitySchemes', 'accessTokenCookie', {
  type: 'apiKey',
  in: 'cookie',
  name: 'access_token',
  description: 'Authentication based on HTTP-only cookie.',
});
registry.registerComponent('securitySchemes', 'refreshTokenCookie', {
  type: 'apiKey',
  in: 'cookie',
  name: 'refresh_token',
  description: 'Refresh token to renovate the user access.',
});

// configuration for schemas and routes
registerUserDocs(registry);
registerCategoryDocs(registry);
registerHabitDocs(registry);
registerGoalDocs(registry);
registry.register('EntityId', EntityIdSchema);

export function generateOpenApiSpec() {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'Fokus API',
      version: '1.0.0',
      description: 'Documentação da API do Fokus.',
    },
    servers: [{ url: API_URL }],
  });
}

export const swaggerDocs = [
  swaggerUi.serve,
  swaggerUi.setup(generateOpenApiSpec()),
];
