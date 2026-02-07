import type {
  EntityIdDTO,
  HabitStatsDTO,
  ProgressLogCreateDTO,
  ProgressLogFilterDTO,
  ProgressLogResponseDTO,
} from '@fokus/shared';
import type { ProgressLogDocument } from '../models/progress-log.model.js';
import type { ProgressLogDeleteDTO } from '../types/progress-log.types.js';

/**
 * Repository interface for managing progress log data persistence.
 * @throws *`DatabaseError`* If:
 * - A database connection or execution error occurs.
 * - The provided data on a specific method is not valid.
 */
export interface IProgressLogRepository {
  /**
   * Persists a new user progress log in the database.
   * @param newData - The new progress log data (habit or goal completion).
   * @returns The created progress log document.
   * @throws *`DatabaseError`* If, in case for a habit log, a progress log with the same *`habitId`*
   * and *`date`* is already registered.
   */
  create(newData: ProgressLogCreateDTO): Promise<ProgressLogDocument>;

  /**
   * Returns an user progress log by its ID.
   * @param progressLogId - The log ID to be searched for.
   * @param userId - The owner ID to ensure authorization.
   * @returns The progress log document if found, or *`null`* otherwise.
   */
  findOneById(
    progressLogId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<ProgressLogDocument | null>;

  /**
   * Returns an user progress logs by a specific filter criteria.
   * @param filter - The filter to be applied (period, entity type, entity ID, etc).
   * @param userId - The owner ID to ensure data authorization.
   * @returns An array of progress log documents.
   */
  findByFilter(
    filter: ProgressLogFilterDTO,
    userId: EntityIdDTO,
  ): Promise<ProgressLogDocument[]>;

  /**
   * Returns a list of dates where activities were recorded for habits or goals of an
   * user.
   * @param entityType - The type of entity to fetch dates for.
   * @param userId - The owner ID to ensure data authorization.
   * @param entityId - Optional ID to filter dates for a specific habit or goal.
   * @returns An array of objects containing the entity ID and its associated activity dates.
   */
  getEntityDates(
    entityType: 'habitId' | 'goalId',
    userId: EntityIdDTO,
    entityId?: EntityIdDTO,
  ): Promise<{ entityId: EntityIdDTO; dates: Date[] }[]>;

  /**
   * Aggregates the sum of values recorded for goals of an user.
   * @param userId - The owner ID to ensure data authorization.
   * @param goalId - Optional ID to fetch the current value of a specific goal.
   * @returns An array of objects containing the goal ID and its current accumulated value.
   */
  getGoalCurrentValues(
    userId: EntityIdDTO,
    goalId?: EntityIdDTO,
  ): Promise<{ goalId: EntityIdDTO; currentValue: number }[]>;

  /**
   * Deletes a user progress log, searching for its ID.
   * @param progressLogId - The log ID to be removed.
   * @param userId - The owner ID to ensure data authorization.
   * @returns The deleted progress log document if found, or *`null`* otherwise.
   */
  delete(
    progressLogId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<ProgressLogDocument | null>;

  /**
   * Deletes a user progress log by a specific filter criteria.
   * @param filter - The filter criteria.
   * @param userId - The owner ID to ensure data authorization.
   * @returns The number of deleted documents.
   */
  deleteByFilter(
    filter: ProgressLogDeleteDTO,
    userId: EntityIdDTO,
  ): Promise<number>;
}

/**
 * Service interface for managing progress log business logic and statistics.
 * Wraps Repository layer calls and calculates activity metrics.
 * @throws *`AppServerError`* If an error occurs in the Repository layer.
 */
export interface IProgressLogService {
  /**
   * Creates a new authenticated user progress log entry.
   * @param newData - The progress log data.
   * @returns The sanitized progress log data.
   */
  create(newData: ProgressLogCreateDTO): Promise<ProgressLogResponseDTO>;

  /**
   * Returns an authenticated user progress log by its ID.
   * @param progressLogId - The log ID to be searched for.
   * @param userId - The owner ID to ensure authorization.
   * @returns The sanitized progress log data.
   * @throws *`AppServerError`* If the log is not found or unauthorized.
   */
  findOneById(
    progressLogId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<ProgressLogResponseDTO>;

  /**
   * Returns authenticated user progress logs based on specific filters.
   * @param filter - The filter criteria.
   * @param userId - The owner ID to ensure data authorization.
   * @returns An array of sanitized progress log data.
   */
  findByFilter(
    filter: ProgressLogFilterDTO,
    userId: EntityIdDTO,
  ): Promise<ProgressLogResponseDTO[]>;

  /**
   * Calculates activity statistics for habits (streaks, best streak, etc) of an
   * authenticated user.
   * @param userId - The owner ID to ensure data authorization.
   * @param habitId - Optional ID to get stats for a single habit.
   * @returns A record mapping habit IDs to their respective statistics.
   */
  getHabitActivityStats(
    userId: EntityIdDTO,
    habitId?: EntityIdDTO,
  ): Promise<Record<EntityIdDTO, HabitStatsDTO>>;

  /**
   * Calculates the current progress values for goals of an authenticated user.
   * @param userId - The owner ID to ensure data authorization.
   * @param goalId - Optional ID to get the current value for a single goal.
   * @returns A record mapping goal IDs to their current accumulated values.
   */
  getGoalActivityStats(
    userId: EntityIdDTO,
    goalId?: EntityIdDTO,
  ): Promise<Record<EntityIdDTO, number>>;

  /**
   * Removes an authenticated user progress log entry, searching for its ID.
   * @param progressLogId - The log ID to be searched for.
   * @param userId - The owner ID to ensure authorization.
   * @returns The sanitized progress log data that was deleted.
   * @throws *`AppServerError`* If the log is not found or unauthorized.
   */
  delete(
    progressLogId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<ProgressLogResponseDTO>;

  /**
   * Deletes an authenticated user progress logs by a filter criteria. If the *`filter.date`*
   * is provided, it deletes a single log, otherwise, all the logs related with the provided *`filter.entityId`*
   * will be deleted.
   * @param filter - The filter criteria.
   * @param userId - The owner ID to ensure data authorization.
   * @returns The number of deleted documents.
   * @throws *`AppServerError`* If the log is not found or unauthorized.
   */
  deleteByFilter(
    filter: ProgressLogDeleteDTO,
    userId: EntityIdDTO,
  ): Promise<number>;
}
