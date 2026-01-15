import type { CategoryDocument } from '../models/category-model.js';
import type { GoalDocument } from '../models/goal-model.js';
import type { HabitDocument } from '../models/habit-model.js';
import type { ProgressLogDocument } from '../models/progress-log-model.js';
import type { UserDocument } from '../models/user-model.js';
import type {
  ProgressLogResponseDTO,
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
    progressImpactValue: habit.progressImpactValue,
    unitOfMeasure: habit.unitOfMeasure,
    weekDays: habit.weekDays,
    reminder: habit.reminder,
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
    categoryId: goal.categoryId?.toString() || null,
    title: goal.title,
    type: goal.type,
    currentValue: goal.currentValue,
    targetValue: goal.targetValue,
    unitOfMeasure: goal.unitOfMeasure,
    habits: goal.habits.map((id) => id.toString()),
    deadline: goal.deadline,
    isActive: goal.isActive,
    color: goal.color,
    icon: goal.icon,
  };
}

export function mapProgressLogDocToPublicDTO(
  progressLog: ProgressLogDocument,
): ProgressLogResponseDTO {
  return {
    id: progressLog._id.toString(),
    userId: progressLog.userId.toString(),
    goalId: progressLog.goalId?.toString() || null,
    habitId: progressLog.habitId?.toString() || null,
    value: progressLog.value,
    dateString: progressLog.dateString,
  };
}
