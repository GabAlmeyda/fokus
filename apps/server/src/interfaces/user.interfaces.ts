import type {
  UserRegisterDTO,
  HTTPRequest,
  AuthResponseDTO,
  UserLoginDTO,
  UserResponseDTO,
  UserUpdateDTO,
  HTTPResponse,
  EntityIdDTO,
} from '@fokus/shared';
import type { UserDocument } from '../models/user.model.js';

/**
 * Repository interface for managing user data persistence.
 * @throws *`DatabaseError`* If:
 * - A database connection or execution error occurs.
 * - The provided data on a specific method is not valid.
 */
export interface IUserRepository {
  /**
   * Persists a new user in the database.
   * @param registerData - The new user data to be stored.
   * @returns The registered user document.
   * @throws *`DatabaseError`* If the provided email is already registered.
   */
  register(registerData: UserRegisterDTO): Promise<UserDocument>;

  /**
   * Returns a user by its email.
   * @param email - The user email to be searched for.
   * @returns The user document if found, or *`null`* otherwise.
   */
  findOneByEmail(email: string): Promise<UserDocument | null>;

  /**
   * Returns a user by its ID.
   * @param userId - The user ID to be searched for.
   * @returns The user document if found, or *`null`* otherwise.
   */
  findOneById(userId: EntityIdDTO): Promise<UserDocument | null>;

  /**
   * Updates a user, searching for its ID.
   * @param userId - The user ID to be searched for.
   * @param newData - The data to be updated.
   * @returns The updated user document if found, or *`null`* otherwise.
   * @throws *`DatabaseError`* If, in case the email is provided, it is already
   * registered.
   */
  update(
    userId: EntityIdDTO,
    newData: UserUpdateDTO,
  ): Promise<UserDocument | null>;

  /**
   * Deletes a user, searching for its ID.
   * @param userId - The user ID to be searched for.
   * @returns The deleted user if found, or *`null`* otherwise.
   */
  delete(userId: EntityIdDTO): Promise<UserDocument | null>;
}

/**
 * Service interface for managing user data business logic.
 * Wraps Repository layer calls and sanitizes the returned data.
 * @throws *`DatabaseError`* If a error occurs in the Repository layer.
 */
export interface IUserService {
  /**
   * Register a new user.
   * @param registerData - The new user data.
   * @returns The sanitized user data and authentication tokens.
   * @throws *`AppServerError`* if the provided email is already registered.
   */
  register(registerData: UserRegisterDTO): Promise<AuthResponseDTO>;

  /**
   * Logins a registered user.
   * @param loginData - The registered login data.
   * @returns The sanitized user data and authentication tokens.
   * @throws *`AppServerError`* If:
   * - The user is not found.
   * - The password is invalid.
   */
  login(loginData: UserLoginDTO): Promise<AuthResponseDTO>;

  /**
   * Invalidates the current refresh token and creates a new one, resending the
   * sanitized user data and authentication tokens.
   * @param token - The refresh token to be searched for.
   * @returns The sanitized user data and authentication tokens.
   * @throws *`AppServerError`* If:
   * - The token is not found.
   * - The token is expired.
   * - The token is still valid to be used.
   */
  refreshToken(token: string): Promise<AuthResponseDTO>;

  /**
   * Returns a user by its ID.
   * @param userId - The user ID to be searched for.
   * @returns The sanitized user data.
   * @throws *`AppServerError`* If the user is not found.
   */
  findOneById(userId: EntityIdDTO): Promise<UserResponseDTO>;

  /**
   * Updates a user, searching for its ID.
   * @param userId - The user ID to be searched for.
   * @param newData - The data to be updated.
   * @returns The sanitized user data.
   * @throws *`AppServerError`* If:
   * - The user is not found.
   * - The email, if provided, is already registered.
   */
  update(userId: EntityIdDTO, newData: UserUpdateDTO): Promise<UserResponseDTO>;

  /**
   * Removes a user, searching for its ID.
   * @param userId - The user ID to be searched for.
   * @throws *`AppServerError`* If the user is not found.
   */
  delete(userId: EntityIdDTO): Promise<void>;
}

/**
 * Controller interface for managing user HTTP requests.
 * Orchestrates Service layer calls and sanitizes the returned data into a *`HTTPResponse`*
 * object.
 */
export interface IUserController {
  /**
   * Registers a new user.
   * @param req - The request object containing the register data in the body.
   * @returns The HTTP response with:
   * - 201 (Created): On success, containing the sanitized user data and authentication
   * tokens.
   * - 400 (Bad Request): On failure, if the input data is invalid.
   * - 409 (Conflict): On failure, if the email is already registered.
   */
  register(
    req: HTTPRequest<UserRegisterDTO>,
  ): Promise<HTTPResponse<AuthResponseDTO>>;

  /**
   * Logins a registered user.
   * @param req - The request object, containing the login data in the body.
   * @returns The HTTP response with:
   * - 200 (Ok): On success, containing the sanitized user data and authentication
   * tokens.
   * - 400 (Bad Request): On failure, if the input data is invalid.
   * - 401 (Unauthorized): On failure, either the email or password is invalid.
   */
  login(req: HTTPRequest<UserLoginDTO>): Promise<HTTPResponse<AuthResponseDTO>>;

  /**
   * Refreshes the token, resending the sanitized user data and authentication tokens.
   * @param req - The request object, containing the *`refresh-token`* in the cookies.
   * @returns The HTTP response with:
   * - 200 (Ok): On success, containing the sanitized user data and authentication
   * tokens.
   * - 401 (Unauthorized): On failure, if the provided token is still valid.
   * - 403 (Forbidden): On failure, if the provided token is revoked and is not in the grace period
   * interval (10 seconds).
   */
  refreshToken(req: HTTPRequest<null>): Promise<HTTPResponse<AuthResponseDTO>>;

  /**
   * Returns a user by its ID.
   * @param req - The request object, containing the authenticated *`userId`*
   * in the cookies.
   * @returns The HTTP response with:
   * - 200 (Ok): On success, containing the sanitized user data.
   * - 401 (Unauthorized): On failure, if the token is not provided or the user is not found.
   * - 403 (Forbidden): On failure, if the provided token expired or invalid.
   */
  findOneById(req: HTTPRequest<null>): Promise<HTTPResponse<UserResponseDTO>>;

  /**
   * Updates a user, searching for its ID.
   * @param req - The request object, containing the authenticated *`userId`*
   * in the cookies and the new user data in the body.
   * @returns The HTTP response with:
   * - 200 (Ok): On success, containing the sanitized user data.
   * - 404 (Not Found): On failure, if the user if not found.
   * - 422 (Unprocessable): On failure, if the provided data is invalid.
   */
  update(
    req: HTTPRequest<UserUpdateDTO>,
  ): Promise<HTTPResponse<UserResponseDTO>>;

  /**
   * Deletes a user, searching for its ID.
   * @param req - The request object, containing the authenticated *`userId`*
   * in the cookies.
   * @returns The HTTP response with:
   * - 200 (Ok): On success, returning *`null`*.
   * - 404 (Not Found): On failure, if the user if not found.
   */
  delete(req: HTTPRequest<null>): Promise<HTTPResponse<null>>;
}
