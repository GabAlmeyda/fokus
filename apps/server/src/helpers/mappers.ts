import type { UserDocument } from '../models/user-model.js';
import type { ResponseUserDTO } from '@fokus/shared';

export function mapUserDocToPublicDTO(user: UserDocument): ResponseUserDTO {
  return {
    id: user._id.toString(),
    email: user.email,
    themeMode: user.themeMode,
    name: user.name,
  };
}
