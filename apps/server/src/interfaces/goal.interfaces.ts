import type {
  GoalCreateDTO,
  GoalFilterDTO,
  HTTPRequest,
  HTTPResponse,
  EntityIdDTO,
  GoalResponseDTO,
  GoalUpdateDTO,
  GoalProgressLogDTO,
} from '@fokus/shared';
import type { GoalDocument } from '../models/goal.model.js';

/**
 * Repository interface for managing goal data persistence.
 * @throws *`DatabaseError`* If:
 * - A database connection or execution error occurs.
 * - The provided data on a specific method is not valid.
 */
export interface IGoalRepository {
  /**
   * Persists a new goal in the database.
   * @param newData - The new goal data to be stored.
   * @returns The created goal document.
   * @throws *`DatabaseError`* If:
   * - The user already has a goal with the provided title.
   */
  create(newData: GoalCreateDTO): Promise<GoalDocument>;

  /**
   * Returns a user goal by its ID.
   * @param goalId - The goal ID to be searched for.
   * @param userId - The owner ID to ensure authorization.
   * @returns The goal document if found, or *`null`* otherwise.
   */
  findOneById(
    goalId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<GoalDocument | null>;

  /**
   * Returns user goals by a specific filter criteria.
   * @param filter - The filter to be applied (title, category ID, etc).
   * @param userId - The owner ID to ensure data authorization.
   * @returns An array of goal documents.
   */
  findByFilter(
    filter: GoalFilterDTO,
    userId: EntityIdDTO,
  ): Promise<GoalDocument[]>;

  /**
   * Updates a user goal, searching for its ID.
   * @param goalId - The goal ID to be updated.
   * @param newData - The new data to be updated.
   * @param userId - The owner ID to ensure data authorization.
   * @returns The updated goal document if found, or *`null`* otherwise.
   */
  update(
    goalId: EntityIdDTO,
    newData: GoalUpdateDTO,
    userId: EntityIdDTO,
  ): Promise<GoalDocument | null>;

  /**
   * Deletes a user goal, searching for its ID.
   * @param goalId - The goal ID to be removed.
   * @param userId - The owner ID to ensure data authorization.
   * @returns The deleted goal document if found, or *`null`* otherwise.
   */
  delete(
    goalId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<GoalDocument | null>;
}

/**
 * Service interface for managing goal business logic.
 * Wraps Repository layer calls and sanitizes the returned data.
 * @throws *`AppServerError`* If an error occurs in the Repository layer.
 */
export interface IGoalService {
  /**
   * Creates a new goal for a specific user.
   * @param newData - The new goal data.
   * @returns The sanitized goal data.
   * @throws *`AppServerError`* If, in case a *`habitId`* is provided, the goal and habit types
   * are incompatible.
   */
  create(newData: GoalCreateDTO): Promise<GoalResponseDTO>;

  /**
   * Returns a user goal by its ID.
   * @param goalId - The goal ID to be searched for.
   * @param userId - The owner ID to ensure authorization.
   * @returns The sanitized goal data.
   * @throws *`AppServerError`* If:
   * - The goal is not found or unauthorized.
   */
  findOneById(
    goalId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<GoalResponseDTO>;

  /**
   * Returns user goals based on filters.
   * @param filter - The filter criteria.
   * @param userId - The owner ID to ensure data authorization.
   * @returns An array of sanitized goal data.
   */
  findByFilter(
    filter: GoalFilterDTO,
    userId: EntityIdDTO,
  ): Promise<GoalResponseDTO[]>;

  /**
   * Updates a user goal.
   * @param goalId - The goal ID to be searched for.
   * @param newData - The data to be updated.
   * @param userId - The owner ID to ensure authorization.
   * @returns The updated sanitized goal data.
   * @throws *`AppServerError`* If:
   * - The goal is not found or unauthorized.
   * - The provided data is not compatible with the registered data.
   */
  update(
    goalId: EntityIdDTO,
    newData: GoalUpdateDTO,
    userId: EntityIdDTO,
  ): Promise<GoalResponseDTO>;

  /**
   * Removes a user goal.
   * @param goalId - The goal ID to be searched for.
   * @param userId - The owner ID to ensure authorization.
   * @throws *`AppServerError`* If:
   * - The goal is not found or unauthorized.
   */
  delete(goalId: EntityIdDTO, userId: EntityIdDTO): Promise<void>;
}

/**
 * Service interface specialized in goal progress and completion logic.
 * Uses the:
 * - *`GoalService`* layer.
 * - *`ProgressLogService`* layer.
 */
export interface IGoalCompletionService {
  /**
   * Adds an user progress log to a goal and registers the action in progress logs.
   * @param progressEntry - The log data.
   * @returns The updated sanitized goal data.
   * @throws *`AppServerError`* If:
   * - The goal is not found.
   * - The provided data is incompatible with the registered data.
   */
  addProgressLog(
    progressLog: GoalProgressLogDTO,
  ): Promise<{ updatedGoal: GoalResponseDTO; progressLogId: EntityIdDTO }>;

  /**
   * Removes an user progress entry of a goal, searching for its ID.
   * @param progressLogId - The progress log ID to be searched for.
   * @param userId - The owner ID to ensure authorization.
   * @returns The updated sanitized goal data.
   * @throws *`AppServerError`* If:
   * - The progress entry is not found or unauthorized.
   */
  removeProgressEntry(
    progressLogId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<GoalResponseDTO>;
}

/**
 * Controller interface for managing goal HTTP requests.
 * Orchestrates Service layer calls and sanitizes the returned data into a *`HTTPResponse`*
 * object.
 */
export interface IGoalController {
  /**
   * Registers a new goal for the authenticated user.
   * @param req - The request object containing the goal data in the body and the
   * authenticated *`userId`*.
   * @returns The HTTP response with:
   * - 201 (Created): On success, containing the sanitized goal.
   * - 400 (Bad Request): On failure, if the goal data format is invalid.
   * - 409 (Conflict): On failure, if a goal with the provided title is already registered.
   * - 422 (Unprocessable): On failure, if the goal data content is invalid.
   */
  create(
    req: HTTPRequest<GoalCreateDTO>,
  ): Promise<HTTPResponse<GoalResponseDTO>>;

  /**
   * Returns a goal by its ID for the authenticated user.
   * @param req - The request object containing the *`goalId`* in the params and the
   * authenticated *`userId`*.
   * @returns The HTTP response with:
   * - 200 (Ok): On success, containing the sanitized habit.
   * - 400 (Bad Request): On failure, if the goal ID format is invalid.
   * - 404 (Not Found): On failure, if the goal is not found or unauthorized.
   */
  findOneById(req: HTTPRequest<null>): Promise<HTTPResponse<GoalResponseDTO>>;

  /**
   * Returns goals based on filters for the authenticated user.
   * @param req - The request object containing the *`GoalFilterDTO`* in the query and the
   * authenticated *`userId`*.
   * @returns The HTTP response with:
   * - 200 (Ok): On success, containing an array of sanitized goals.
   * - 400 (Bad Request): On failure, if the filter data format is invalid.
   * - 422 (Unprocessable): On failure, if the filter data content is invalid.
   */
  findByFilter(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<GoalResponseDTO[]>>;

  /**
   * Adds a progress log (value increment) to a specific goal for a authenticated user.
   * @param req - The request object containing the *`goalId`* in the params, the progress
   * data in the body, and the authenticated *`userId`*.
   * @returns The HTTP response with:
   * 200 (Ok): On success, containing the sanitized updated goal and the progress log ID.
   * 400 (Bad Request): On failure, if the provided data format is invalid.
   * 422 (Unprocessable): On failue, if the provided data content is invalid or the provided
   * goal data is incompatible with the registered goal data.
   */
  addProgressLog(
    req: HTTPRequest<Pick<GoalProgressLogDTO, 'date' | 'value'>>,
  ): Promise<
    HTTPResponse<{ updatedGoal: GoalResponseDTO; progressLogId: EntityIdDTO }>
  >;

  /**
   * Removes a progress log of a specific goal for a authenticated user.
   * @param req - The request object containing the *`progressLogId`* in the params, and the
   * authenticated *`userId`*.
   * @returns The HTTP response with:
   * 200 (Ok): On success, containing the sanitized updated goal.
   * 400 (Bad Request): On failure, if the provided data format is invalid.
   * 422 (Unprocessable): On failue, if the provided data content is invalid or the provided
   * goal data is incompatible with the registered goal data.
   */
  removeProgressLog(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<GoalResponseDTO>>;

  /**
   * Updates a goal for the authenticated user.
   * @param req - The request object containing the *`goalId`* in the params, the updated data in
   * the body, and the authenticated *`userId`*.
   * @returns The HTTP response with:
   * - 200 (Ok): On success, containing the sanitized updated goal.
   * - 400 (Bad Request): On failure, if the new goal data format, or the goal ID, is invalid.
   * - 404 (Not Found): On failue, if the goal is not found or unauthorized.
   * - 422 (Unprocessable): On failue, if the new goal data content is invalid or is not compatible with
   * the registered goal data.
   */
  update(
    req: HTTPRequest<GoalUpdateDTO>,
  ): Promise<HTTPResponse<GoalResponseDTO>>;

  /**
   * Deletes a goal for the authenticated user.
   * @param req - The request object containing the *`goalId`* in the params and the
   * authenticated *`userId`* in the cookies.
   * @returns The HTTP response with:
   * - 200 (Ok): On success, containing *`null`*.
   * - 400 (Bad Request): On failure, if the goal ID format is invalid.
   * - 404 (Not Found): On failure, if the goal is not found or unauthorized.
   */
  delete(req: HTTPRequest<null>): Promise<HTTPResponse<null>>;
}
