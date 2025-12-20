import * as z from 'zod';

export const RegisterUserSchema = z.object({
  name: z
    .string("Expected type was 'string'.")
    .min(2, 'Name cannot be less than 2 characters.')
    .trim(),

  email: z.email('Invalid email provided.').toLowerCase().trim(),

  password: z
    .string("Expected type was 'string'.")
    .min(8, 'Password cannot be less than 8 characters.')
    .trim(),

  themeMode: z.literal(
    ['light', 'dark'],
    `Theme mode can only be 'light' or 'dark'.`,
  ),
});

export const UpdateUserSchema = RegisterUserSchema.omit({
  password: true,
}).partial();

export const LoginUserSchema = RegisterUserSchema.pick({
  email: true,
  password: true,
});

export const ResponseUserSchema = RegisterUserSchema.omit({
  password: true,
}).extend({
  id: z.string("Expected type was 'string'."),
});

export const ResponseAuthSchema = z.object({
  user: ResponseUserSchema,
  token: z.jwt('Invalid JsonWebToken provided.'),
});

export const TokenPayloadSchema = z.object({
  id: z
    .string("Expected type was 'string'.")
    .regex(/^[0-9a-zA-Z]{24}$/, 'Invalid ID format provided.'),
  email: z.email('Invalid email provided.'),
});

export type RegisterUserDTO = z.infer<typeof RegisterUserSchema>;
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;
export type LoginUserDTO = z.infer<typeof LoginUserSchema>;
export type ResponseUserDTO = z.infer<typeof ResponseUserSchema>;
export type ResponseAuthDTO = z.infer<typeof ResponseAuthSchema>;
export type TokenPayloadDTO = z.infer<typeof TokenPayloadSchema>;
