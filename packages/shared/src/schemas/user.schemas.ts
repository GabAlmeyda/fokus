import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { EntityIdSchema } from './id.schemas.js';

extendZodWithOpenApi(z);

const UserBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Nome deve ter no mínimo 2 caracteres.')
    .openapi({ description: 'User name.', example: 'Gabriel Almeida de Lima' }),

  email: z
    .email('Email inválido digitado.')
    .toLowerCase()
    .trim()
    .openapi({ description: 'User email.', example: 'almeida@gmail.com' }),
  password: z
    .string()
    .trim()
    .min(8, 'Senha deve ter no mínimo 8 caracteres.')
    .openapi({
      description: 'User password.',
      example: 'almeida123',
      writeOnly: true,
    }),

  themeMode: z
    .enum(['light', 'dark'], {
      error: () => ({
        message: `Tema de usuário pode ser apenas 'light' ou 'dark'.`,
      }),
    })
    .openapi({
      description: 'User selected theme.',
      example: 'light',
    }),
});

export const UserRegisterSchema = UserBaseSchema.extend({
  themeMode: UserBaseSchema.shape.themeMode
    .default('light')
    .openapi({ default: 'light' }),
}).openapi('UserRegister');
export type UserRegisterDTO = z.infer<typeof UserRegisterSchema>;

export const UserUpdateSchema = UserBaseSchema.omit({
  password: true,
})
  .partial()
  .openapi('UserUpdate');
export type UserUpdateDTO = z.infer<typeof UserUpdateSchema>;

export const UserLoginSchema = UserBaseSchema.pick({
  email: true,
  password: true,
}).openapi('UserLogin');
export type UserLoginDTO = z.infer<typeof UserLoginSchema>;

export const UserResponseSchema = UserBaseSchema.omit({
  password: true,
})
  .extend({
    id: EntityIdSchema.openapi({
      description: 'User ID.',
      example: '65f2a1b8c9d0e1f2a3b4c5d6',
      readOnly: true,
    }),
  })
  .openapi('UserResponse');
export type UserResponseDTO = z.infer<typeof UserResponseSchema>;
