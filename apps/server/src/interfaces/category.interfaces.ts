import type {
  CategoryCreateDTO,
  CategoryResponseDTO,
  EntityIdDTO,
  CategoryFilterDTO,
  CategoryUpdateDTO,
  HTTPRequest,
  HTTPResponse,
} from '@fokus/shared';
import type { CategoryDocument } from '../models/category.model.js';

/**
 * Repository interface for managing category data persistence.
 * @throws *`DatabaseError`* If:
 * - A database connection or execution error occurs.
 * - The provided data on a specific method is not valid.
 */
export interface ICategoryRepository {
  /**
   * Persists a new category in the database.
   * @param newData - The new category data to be stored.
   * @returns The created category document.
   * @throws *`DatabaseError`* If the user already has a category with the
   * provided name.
   */
  create(newData: CategoryCreateDTO): Promise<CategoryDocument>;

  /**
   * Returns a user category by its ID.
   * @param categoryId - The category ID to be searched for.
   * @param userId - The owner ID to ensure authorization.
   * @returns The category document if found, or *`null`* otherwise.
   */
  findOneById(
    categoryId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<CategoryDocument | null>;

  /**
   * Returns a user category by a specific filter criteria.
   * @param filter - The filter to be aplied in the search.
   * @param userId - The owner ID to ensure data authorization.
   * @returns An array of category documents.
   */
  findByFilter(
    filter: CategoryFilterDTO,
    userId: string,
  ): Promise<CategoryDocument[]>;

  /**
   * Updates a user category, searching for its ID.
   * @param categoryId - The category ID to be searched for.
   * @param newData - The new data to be updated.
   * @param userId - The owner ID to ensure data authorization.
   * @returns The updated category document if found, or *`null`* otherwise.
   */
  update(
    categoryId: EntityIdDTO,
    newData: CategoryUpdateDTO,
    userId: EntityIdDTO,
  ): Promise<CategoryDocument | null>;

  /**
   * Deletes a user category, searching for its ID.
   * @param categoryId - The category ID to be searched for.
   * @param userId - The ownew ID to ensure data authorization.
   * @returns The deleted category document if found, or *`null`* otherwise.
   */
  delete(
    categoryId: string,
    userId: EntityIdDTO,
  ): Promise<CategoryDocument | null>;
}

/**
 * Service interface for managing category business logic.
 * Wraps Repository layer calls, validates ownership, and sanitizes the returned data.
 * @throws *`AppServerError`* If an error occurs in the Repository layer.
 */
export interface ICategoryService {
  /**
   * Creates a new category for a specific user.
   * @param newData - The new category data.
   * @returns The sanitized category data.
   * @throws *`AppServerError`* If the user already has a category with the same name.
   */
  create(newData: CategoryCreateDTO): Promise<CategoryResponseDTO>;

  /**
   * Returns a user category by its ID.
   * @param categoryId - The category ID to be searched for.
   * @param userId - The owner ID to ensure authorization.
   * @returns The sanitized category data.
   * @throws *`AppServerError`* If the category is not found or does not belong to the user.
   */
  findOneById(
    categoryId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<CategoryResponseDTO>;

  /**
   * Returns all categories of a user based on specific filters.
   * @param filter - The filter criteria.
   * @param userId - The owner ID to ensure data authorization.
   * @returns An array of sanitized category data.
   */
  findByFilter(
    filter: CategoryFilterDTO,
    userId: EntityIdDTO,
  ): Promise<CategoryResponseDTO[]>;

  /**
   * Updates a user category.
   * @param newData - The new data to be updated.
   * @param categoryId - The category ID to be searched for.
   * @param userId - The owner ID to ensure authorization.
   * @returns The updated and sanitized category data.
   * @throws *`AppServerError`* If:
   * - The category is not found.
   * - The new name, if provided, already exists for this user.
   */
  update(
    newData: CategoryUpdateDTO,
    categoryId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<CategoryResponseDTO>;

  /**
   * Removes a user category.
   * @param categoryId - The category ID to be searched for.
   * @param userId - The owner ID to ensure authorization.
   * @throws *`AppServerError`* If the category is not found or does not belong
   * to the user.
   */
  delete(categoryId: EntityIdDTO, userId: EntityIdDTO): Promise<void>;
}

/**
 * Controller interface for managing category HTTP requests.
 * Orchestrates Service layer calls and sanitizes the returned data into a *`HTTPResponse`*
 * object, extracting the *`userId`* from the request context.
 */
export interface ICategoryController {
  /**
   * Registers a new category for the authenticated user.
   * @param req - The request object containing the category data in the body and the
   * authenticated *`userId`*.
   * @returns The HTTP response with:
   * - 201 (Created): On success, containing the sanitized category data.
   * - 400 (Bad Request): On failure, if the category data format, or the category ID format, is invalid.
   * - 409 (Conflict): On failure, if a category with that name already exists for the user.
   * - 422 (Unprocessable): On failure, if the category data content is invalid.
   */
  create(
    req: HTTPRequest<Omit<CategoryCreateDTO, 'userId'>>,
  ): Promise<HTTPResponse<CategoryResponseDTO>>;

  /**
   * Returns a category by its ID for the authenticated user.
   * @param req - The request object containing the *`categoryId`* in the params
   * and the authenticated *`userId`*.
   * @returns The HTTP response with:
   * - 200 (Ok): On success, containing the sanitized category data.
   * - 400 (Bad Request): On failure, if the category ID format is invalid.
   * - 404 (Not Found): On failure, if the category is not found or unauthorized.
   */
  findOneById(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<CategoryResponseDTO>>;

  /**
   * Returns categories of the authenticated user based on filters.
   * @param req - The request object containing the *`CategoryFilterDTO`* in the query params
   * and the authenticated *`userId`*.
   * @returns The HTTP response with:
   * - 200 (Ok): On success, containing the list of categories.
   * - 400 (Bad Request): On failure, if the filter data format is invalid.
   * - 422 (Unprocessable): On failure, if the filter data content is invalid.
   */
  findByFilter(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<CategoryResponseDTO[]>>;

  /**
   * Updates a category for the authenticated user.
   * @param req - The request object containing the *`categoryId`* in the params,
   * the new category data in the body and the authenticated *`userId`*.
   * @returns The HTTP response with:
   * - 200 (Ok): On success, containing the sanitized updated category.
   * - 400 (Bad Request): On failure, if the new category data format, or the category ID format, is
   * invalid.
   * - 404 (Not Found): On failure, if the category is not found.
   * - 422 (Unprocessable): On failure, if the update data content is invalid.
   */
  update(
    req: HTTPRequest<CategoryUpdateDTO>,
  ): Promise<HTTPResponse<CategoryResponseDTO>>;

  /**
   * Deletes a category for the authenticated user.
   * @param req - The request object containing the *`categoryId`* in the params
   * and the authenticated *`userId`*.
   * @returns The HTTP response with:
   * - 200 (Ok): On success, returning *`null`*.
   * - 400 (Bad Request): On failure, if the category ID format is invalid.
   * - 404 (Not Found): On failure, if the category is not found or unauthorized.
   */
  delete(req: HTTPRequest<null>): Promise<HTTPResponse<null>>;
}
