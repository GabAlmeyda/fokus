import type {
  HabitCreateDTO,
  HabitFilterDTO,
  HTTPRequest,
  HTTPResponse,
  EntityIdDTO,
  HabitResponseDTO,
  HabitUpdateDTO,
  HabitCheckDTO,
} from '@fokus/shared';
import type { HabitDocument } from '../models/habit.model.js';

/**
 * Repository interface for managing habit data persistence.
 * @throws *`DatabaseError`* If:
 * - A database connection or execution error occurs.
 * - The provided data on a specific method is not valid.
 */
export interface IHabitRepository {
  /**
   * Persists a new habit in the database.
   * @param newData - The new habit data to be stored.
   * @returns The created habit document.
   * @throws *`DatabaseError`* If the user already has a habit with the provided
   * title.
   */
  create(newData: HabitCreateDTO): Promise<HabitDocument>;

  /**
   * Returns a user habit by its ID.
   * @param habitId - The habit ID to be searched for.
   * @param userId - The owner ID to ensure authorization.
   * @returns The habit document if found, or *`null`* otherwise.
   */
  findOneById(
    habitId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<HabitDocument | null>;

  /**
   * Returns user habits by a specific filter criteria.
   * @param filter - The filter to be applied.
   * @param userId - The owner ID to ensure data authorization.
   * @returns An array of habit documents.
   */
  findByFilter(
    filter: HabitFilterDTO,
    userId: EntityIdDTO,
  ): Promise<HabitDocument[]>;

  /**
   * Updates a user habit, searching for its ID.
   * @param habitId - The habit ID to be updated.
   * @param newData - The new data to be updated.
   * @param userId - The owner ID to ensure data authorization.
   * @returns The updated habit document if found, or *`null`* otherwise.
   */
  update(
    habitId: EntityIdDTO,
    newData: HabitUpdateDTO,
    userId: EntityIdDTO,
  ): Promise<HabitDocument | null>;

  /**
   * Deletes a user habit, searching for its ID.
   * @param habitId - The habit ID to be removed.
   * @param userId - The owner ID to ensure data authorization.
   * @returns The deleted habit document if found, or *`null`* otherwise.
   */
  delete(
    habitId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<HabitDocument | null>;
}

/**
 * Service interface for managing habit business logic.
 * Wraps Repository layer calls and sanitizes the returned data.
 * @throws *`AppServerError`* If an error occurs in the Repository layer.
 */
export interface IHabitService {
  /**
   * Creates a new habit for a specific user.
   * @param newData - The new habit data.
   * @returns The sanitized habit data.
   */
  create(newData: HabitCreateDTO): Promise<HabitResponseDTO>;

  /**
   * Returns a user habit by its ID.
   * @param habitId - The habit ID to be searched for.
   * @param userId - The owner ID to ensure authorization.
   * @returns The sanitized habit data.
   * @throws *`AppServerError`* If the habit is not found or unauthorized.
   */
  findOneById(
    habitId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<HabitResponseDTO>;

  /**
   * Returns all habits of a user based on filters.
   * @param filter - The filter criteria.
   * @param userId - The owner ID to ensure data authorization.
   * @returns An array of sanitized habit data.
   */
  findByFilter(
    filter: HabitFilterDTO,
    userId: EntityIdDTO,
  ): Promise<HabitResponseDTO[]>;

  /**
   * Updates a user habit.
   * @param habitId - The habit ID to be searched for.
   * @param newData - The data to be updated.
   * @param userId - The owner ID to ensure authorization.
   * @returns The updated sanitized habit data.
   * @throws *`AppServerError`* If the habit is not found or the provided data
   * is not compatible with the registered data.
   */
  update(
    habitId: EntityIdDTO,
    newData: HabitUpdateDTO,
    userId: EntityIdDTO,
  ): Promise<HabitResponseDTO>;

  /**
   * Removes a user habit.
   * @param habitId - The habit ID to be searched for.
   * @param userId - The owner ID to ensure authorization.
   * @throws *`AppServerError`* If the habit is not found or unauthorized.
   */
  delete(habitId: EntityIdDTO, userId: EntityIdDTO): Promise<void>;
}

/**
 * Service interface specialized in habit completion logic (checking/unchecking).
 * Uses the:
 * - *`HabitService`* layer.
 * - *`GoalService`* layer.
 * - *`ProgressLogService`* layer.
 */
export interface IhabitCompletionService {
  /**
   * Marks a habit as completed and adds a progress log to register the action.
   * @param checkData - The habit ID and completion data.
   * @returns The updated sanitized habit data.
   * @throws *`AppServerError`* If:
   * - The habit is not found.
   * - The provided date is already registered for the habit.
   * - The provided data is invalid.
   */
  check(checkData: HabitCheckDTO): Promise<HabitResponseDTO>;
}

/**
 * Controller interface for managing user HTTP requests.
 * Orchestrates Service layer calls and sanitizes the returned data into a *`HTTPResponse`*
 * object.
 */
export interface IHabitController {
  /**
   * Registers a new habit for the authenticated user.
   * @param req - The request object containing habit data in the body and *`userId`*
   * in the cookies.
   * @returns The HTTP response with:
   * - 201 (Created): On success, containing the sanitized habit.
   * - 400 (Bad Request): On failure, if the habit data format is invalid.
   * - 422 (Unprocessable): On failure, if the habit data content is invalid.
   */
  create(
    req: HTTPRequest<Omit<HabitCreateDTO, 'userId'>>,
  ): Promise<HTTPResponse<HabitResponseDTO>>;

  /**
   * Returns a habit by its ID for the authenticated user.
   * @param req - The request object containing *`habitId`* in the params and *`userId`*
   * in the cookies.
   * @returns The HTTP response with:
   * - 200 (Ok): On success, containing the sanitized habit.
   * - 400 (Bad Request): On failure, if the habit ID format is invalid.
   * - 404 (Not Found): On failure, if the habit is not found or unauthorized.
   */
  findOneById(req: HTTPRequest<null>): Promise<HTTPResponse<HabitResponseDTO>>;

  /**
   * Returns habits based on filters for the authenticated user.
   * @param req - The request object containing the *`HabitFilterDTO`* in the query and *`userId`*
   * in the cookies.
   * @returns The HTTP response with:
   * - 200 (Ok): On success, containing an array of sanitized habits.
   * - 400 (Bad Request): On failure, if the filter data format is invalid.
   * - 422 (Unprocessable): On failure, if the filter data content is invalid.
   */
  findByFilter(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<HabitResponseDTO[]>>;

  /**
   * Updates a habit for the authenticated user.
   * @param req - The request object containing the *`habitId`* in the params, updated data in the
   * body, and *`userId`* in the cookies.
   * @returns The HTTP response with:
   * - 200 (Ok): On success, containing the sanitized updated habit.
   * - 400 (Bad Request): On failure, if the new habit data format, or the habit ID, is invalid.
   * - 404 (Not Found): On failue, if the habit is not found or unauthorized.
   * - 422 (Unprocessable): On failue, if the new habit data content is invalid or is not compatible with
   * the registered habit data.
   */
  update(
    req: HTTPRequest<HabitUpdateDTO>,
  ): Promise<HTTPResponse<HabitResponseDTO>>;

  /**
   * Marks a habit as completed.
   * @param req - The request object containing the *`habitId`* in params, the *`date`* in the query
   * and the authorized *`userId`* in the cookies.
   * @returns The HTTP response with:
   * - 200 (Ok): On success, containing the sanitized updated habit.
   * - 400 (Bad Request): On failure, if the check data format is invalid.
   * - 422 (Unprocessable): On failue, if the check data content is invalid.
   */
  check(req: HTTPRequest<null>): Promise<HTTPResponse<HabitResponseDTO>>;

  /**
   * Deletes a habit for the authenticated user.
   * @param req - Request containing *`habitId`* in params and *`userId`* in cookies.
   * @returns The HTTP response with:
   * - 200 (Ok): On success, containing *`null`*.
   * - 400 (Bad Request): On failure, if the habit ID format is invalid.
   * - 404 (Not Found): On failure, if the habit is not found or unauthorized.
   */
  delete(req: HTTPRequest<null>): Promise<HTTPResponse<null>>;
}
