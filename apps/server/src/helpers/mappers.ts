import type { CategoryDocument } from '../models/category-model.js';
import type { HabitDocument } from '../models/habit-model.js';
import type { UserDocument } from '../models/user-model.js';
import type {
  ResponseCategoryDTO,
  ResponseHabitDTO,
  ResponseUserDTO,
} from '@fokus/shared';

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

export function mapHabitDocToPublicDTO(habit: HabitDocument): ResponseHabitDTO {
  return {
    id: habit._id.toString(),
    userId: habit.userId.toString(),
    title: habit.title,
    type: habit.type,
    progressImpactValue: habit.progressImpactValue || null,
    unitOfMeasure: habit.unitOfMeasure || null,
    weekDays: habit.weekDays,
    reminder: habit.reminder || null,
    streak: habit.streak,
    bestStreak: habit.bestStreak,
    color: habit.color,
    icon: habit.icon,
  };
}
