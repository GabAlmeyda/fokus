import * as z from 'zod';
import { EntityIdSchema, type EntityIdDTO } from './id.schemas.js';

const UserBaseSchema = z.object({
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

export const UserRegisterSchema = UserBaseSchema;
export type UserRegisterDTO = z.infer<typeof UserRegisterSchema>;

export const UserUpdateSchema = UserBaseSchema.omit({
  password: true,
}).partial();
export type UserUpdateDTO = z.infer<typeof UserUpdateSchema>;

export const UserLoginSchema = UserBaseSchema.pick({
  email: true,
  password: true,
});
export type UserLoginDTO = z.infer<typeof UserLoginSchema>;

export const UserResponseSchema = UserBaseSchema.omit({
  password: true,
}).extend({
  id: EntityIdSchema,
});
export type UserResponseDTO = z.infer<typeof UserResponseSchema>;

export const AuthResponseSchema = z.object({
  user: UserResponseSchema,
  accessToken: z.jwt('Invalid JsonWebToken provided.'),
  refreshToken: z.string("Expected type was 'string'."),
});
export type AuthResponseDTO = z.infer<typeof AuthResponseSchema>;

export type TokenPayloadDTO = {
  id: EntityIdDTO;
};
