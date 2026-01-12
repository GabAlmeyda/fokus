import type { CategoryDocument } from '../models/category-model.js';
import type { GoalDocument } from '../models/goal-model.js';
import type { HabitDocument } from '../models/habit-model.js';
import type { UserDocument } from '../models/user-model.js';
import type {
  ResponseCategoryDTO,
  ResponseGoalDTO,
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
    progressImpactValue: (habit.progressImpactValue as number | null) || null,
    unitOfMeasure: (habit.unitOfMeasure as string | null) || null,
    weekDays: habit.weekDays,
    reminder: (habit.reminder as string | null) || null,
    streak: habit.streak,
    bestStreak: habit.bestStreak,
    color: habit.color,
    icon: habit.icon,
  };
}

export function mapGoalDocToPublicDTO(goal: GoalDocument): ResponseGoalDTO {
  return {
    id: goal._id.toString(),
    userId: goal.userId.toString(),
    categoryId: (goal.categoryId as string | null) || null,
    title: goal.title,
    type: goal.type,
    currentValue:
      typeof goal.currentValue === 'number' ? goal.currentValue : null,
    targetValue: typeof goal.targetValue === 'number' ? goal.targetValue : null,
    unitOfMeasure: (goal.unitOfMeasure as string | null) || null,
    habits: goal.habits.map((id) => id.toString()),
    deadline: (goal.deadline as Date | null) || null,
    isActive: goal.isActive,
    color: goal.color,
    icon: goal.icon,
  };
}
