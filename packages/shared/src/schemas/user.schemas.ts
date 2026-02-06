import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { EntityIdSchema, type EntityIdDTO } from './id.schemas.js';

extendZodWithOpenApi(z);

const UserBaseSchema = z.object({
  name: z
    .string("Expected type was 'string'.")
    .trim()
    .min(2, 'Name cannot be less than 2 characters.')
    .openapi({ description: 'User name.', example: 'Gabriel Almeida de Lima' }),

  email: z
    .email('Invalid email provided.')
    .toLowerCase()
    .trim()
    .openapi({ description: 'User email.', example: 'almeida@gmail.com' }),
  password: z
    .string("Expected type was 'string'.")
    .trim()
    .min(8, 'Password cannot be less than 8 characters.')
    .openapi({
      description: 'User password.',
      example: 'almeida123',
      writeOnly: true,
    }),

  themeMode: z
    .enum(['light', 'dark'], {
      error: () => ({
        message: `Theme mode can only be 'light' or 'dark'.`,
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

export const AuthResponseSchema = z
  .object({
    user: UserResponseSchema.openapi({
      description: 'Authenticated user information.',
      example: {
        name: 'Gabriel Almeida de Lima',
        email: 'almeida@gmail.com',
        theme: 'dark',
        id: '65f2a1b8c9d0e1f2a3b4c5d6',
      },
      readOnly: true,
    }),
    accessToken: z.jwt('Invalid JsonWebToken provided.').openapi({
      description:
        'Authenticated user access token, containing the user ID. Expires in 15 minutes.',
      example:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YTFmIn0.signature_here',
      readOnly: true,
    }),
    refreshToken: z.string("Expected type was 'string'.").openapi({
      description:
        'Authenticated user refresh token, used for refresh the access token. Expires in 7 days.',
      example: '599e7161-0b5c-4d37-8820-22165089e359',
      readOnly: true,
    }),
  })
  .openapi('AuthResponse');
export type AuthResponseDTO = z.infer<typeof AuthResponseSchema>;

export type TokenPayloadDTO = {
  id: EntityIdDTO;
};
