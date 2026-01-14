import * as z from 'zod';
import { EntityIdSchema } from './id-schemas.js';

const BaseUserSchema = z.object({
  name: z
    .string("Expected type was 'string'.")
    .trim()
    .min(2, 'Name cannot be less than 2 characters.'),

  email: z.email('Invalid email provided.').toLowerCase().trim(),

  password: z
    .string("Expected type was 'string'.")
    .trim()
    .min(8, 'Password cannot be less than 8 characters.'),

  themeMode: z.enum(['light', 'dark'], {
    error: () => ({
      message: `Theme mode can only be 'light' or 'dark'.`,
    }),
  }),
});

export const RegisterUserSchema = BaseUserSchema;

export const UpdateUserSchema = BaseUserSchema.omit({
  password: true,
}).partial();

export const LoginUserSchema = BaseUserSchema.pick({
  email: true,
  password: true,
});

export const ResponseUserSchema = BaseUserSchema.omit({
  password: true,
}).extend({
  id: EntityIdSchema,
});

export const ResponseAuthSchema = z.object({
  user: ResponseUserSchema,
  token: z.jwt('Invalid JsonWebToken provided.'),
});

export const TokenPayloadSchema = z.object({
  id: EntityIdSchema,
  email: z.email('Invalid email provided.').toLowerCase().trim(),
});

export type RegisterUserDTO = z.infer<typeof RegisterUserSchema>;
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;
export type LoginUserDTO = z.infer<typeof LoginUserSchema>;
export type ResponseUserDTO = z.infer<typeof ResponseUserSchema>;
export type ResponseAuthDTO = z.infer<typeof ResponseAuthSchema>;
export type TokenPayloadDTO = z.infer<typeof TokenPayloadSchema>;
