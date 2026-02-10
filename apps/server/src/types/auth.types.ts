import { UserResponseSchema, type EntityIdDTO } from '@fokus/shared';
import { z } from 'zod';

export const AuthResponseSchema = z.object({
  user: UserResponseSchema,
  accessToken: z.jwt('Invalid JsonWebToken provided.'),
  refreshToken: z.string("Expected type was 'string'."),
});
export type AuthResponseDTO = z.infer<typeof AuthResponseSchema>;

export type TokenPayloadDTO = {
  id: EntityIdDTO;
};
