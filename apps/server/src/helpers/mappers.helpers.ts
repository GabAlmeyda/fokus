import type { CategoryDocument } from '../models/category.model.js';
import type { GoalDocument } from '../models/goal.model.js';
import type { HabitDocument } from '../models/habit.model.js';
import type { ProgressLogDocument } from '../models/progress-log.model.js';
import type { RefreshTokenDocument } from '../models/refresh-token.model.js';
import type { UserDocument } from '../models/user.model.js';
import type {
  ProgressLogResponseDTO,
  CategoryResponseDTO,
  GoalResponseDTO,
  HabitResponseDTO,
  UserResponseDTO,
  HabitStatsDTO,
  GoalStatsDTO,
} from '@fokus/shared';
import type { RefreshTokenResponseDTO } from '../types/refresh-token.types.js';

export function mapUserDocToPublicDTO(user: UserDocument): UserResponseDTO {
  return {
    id: user._id.toString(),
    email: user.email,
    themeMode: user.themeMode,
    name: user.name,
  };
}

export function mapRefreshTokenDocToPublicDTO(
  token: RefreshTokenDocument,
): RefreshTokenResponseDTO {
  return {
    id: token._id.toString(),
    userId: token.userId.toString(),
    token: token.token,
    familyId: token.familyId,
    isRevoked: token.isRevoked,
    replacedAt: token.replacedAt,
    expiresAt: token.expiresAt,
  };
}

export function mapCategoryDocToPublicDTO(
  category: CategoryDocument,
): CategoryResponseDTO {
  return {
    id: category._id.toString(),
    userId: category.userId.toString(),
    name: category.name,
  };
}

export function mapHabitDocToPublicDTO(
  doc: HabitDocument,
  stats: HabitStatsDTO,
): HabitResponseDTO {
  const habit = doc.toObject();

  return {
    id: habit._id.toString(),
    userId: habit.userId.toString(),
    title: habit.title,
    type: habit.type,
    progressImpactValue: habit.progressImpactValue,
    unitOfMeasure: habit.unitOfMeasure,
    weekDays: habit.weekDays,
    reminder: habit.reminder,
    color: habit.color,
    icon: habit.icon,
    streak: stats.streak,
    bestStreak: stats.bestStreak,
    isCompleted: stats.isCompleted,
  };
}

export function mapGoalDocToPublicDTO(
  goal: GoalDocument,
  stats: GoalStatsDTO,
): GoalResponseDTO {
  return {
    id: goal._id.toString(),
    userId: goal.userId.toString(),
    categoryId: goal.categoryId?.toString() || null,
    title: goal.title,
    type: goal.type,
    currentValue: stats.currentValue,
    targetValue: goal.targetValue,
    isCompleted: stats.isCompleted,
    unitOfMeasure: goal.unitOfMeasure,
    habitId: goal.habitId?.toString() || null,
    deadline: goal.deadline,
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
    date: progressLog.date,
  };
}
