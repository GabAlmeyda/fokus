import type { CategoryDocument } from '../models/category-model.js';
import type { UserDocument } from '../models/user-model.js';
import type { ResponseCategoryDTO, ResponseUserDTO } from '@fokus/shared';

export function mapUserDocToPublicDTO(user: UserDocument): ResponseUserDTO {
  return {
    id: user._id.toString(),
    email: user.email,
    themeMode: user.themeMode,
    name: user.name,
  };
}

export function mapCategoryDocToPublicDTO(
  category: CategoryDocument,
): ResponseCategoryDTO {
  return {
    id: category._id.toString(),
    userId: category.userId.toString(),
    name: category.name,
  };
}
