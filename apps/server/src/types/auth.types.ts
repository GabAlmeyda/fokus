import { UserResponseSchema, type EntityIdDTO } from '@fokus/shared';
import { z } from 'zod';

export const AuthResponseSchema = z.object({
  auth: UserResponseSchema,
  accessToken: z.jwt(),
  refreshToken: z.string(),
});
export type AuthResponseDTO = z.infer<typeof AuthResponseSchema>;

export type TokenPayloadDTO = {
  id: EntityIdDTO;
};
