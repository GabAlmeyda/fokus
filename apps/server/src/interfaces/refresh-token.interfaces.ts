import type { EntityIdDTO } from 'packages/shared/dist/index.js';
import type { RefreshTokenDocument } from '../models/refresh-token.model.js';
import type {
  RefreshTokenCreateDTO,
  RefreshTokenResponseDTO,
} from '../types/refresh-token.types.js';

/**
 * Repository interface for managing refresh tokens data persistance.
 * @throws *`DatabaseError`* If a database connection or execution error occurs.
 */
export interface IRefreshTokenRepository {
  /**
   * Persists a new refresh token in the database.
   * @param newData - The new refresh token data to be stored.
   * @returns The new refresh token document.
   * @throws *`DatabaseError`* If the provided token is already
   * registered in the database.
   */
  create(newData: RefreshTokenCreateDTO): Promise<RefreshTokenDocument>;

  /**
   * Returns a refresh token by its raw token string.
   * @param token - The token string to be searched for.
   * @returns The refresh token document if found, or *`null`* otherwise.
   */
  findOneByToken(token: string): Promise<RefreshTokenDocument | null>;

  /**
   * Invalidates a refresh token family by its family ID, revoking all of them.
   * @param familyId - The family ID to be invalidated.
   */
  invalidateFamilyById(familyId: string): Promise<void>;

  /**
   * Revokes a refresh token by its ID.
   * @param refreshTokenId - The refresh token ID to be revoked.
   * @returns The refresh token document if found, or *`null`* otherwise.
   */
  revoke(refreshTokenId: string): Promise<RefreshTokenDocument | null>;

  /**
   * Deletes a refresh token, searching for its raw token string.
   * @param token - The token to be searched for.
   * @return The refresh token document if found, or *`null`* otherwise.
   */
  delete(token: string): Promise<RefreshTokenDocument | null>;

  /**
   * Deletes all refresh tokens of an user.
   * @param userId - The user ID to delete all refresh tokens.
   */
  deleteTokensByUserId(userId: EntityIdDTO): Promise<void>;
}

/**
 * Service interface for managing refresh token business logic.
 * Wraps Repository layer calls and sanitizes the returned data.
 * @throws *`DatabaseError`* If a error occurs in the Repository layer.
 */
export interface IRefreshTokenService {
  /**
   * Creates a new refresh token.
   * @param newData - The new refresh token data.
   * @returns The new sanitized refresh token data.
   * @throws *`AppServerError`* If the provided token is already registered,
   * according to be Repository layer.
   */
  create(newData: RefreshTokenCreateDTO): Promise<RefreshTokenResponseDTO>;

  /**
   * Returns a refresh token by its raw token string.
   * @param token - The token string to be searched for.
   * @returns The sanitized refresh token data.
   * @throws *`AppServerError`* If the refresh token is not found.
   */
  findOneByToken(token: string): Promise<RefreshTokenResponseDTO>;

  /**
   * Invalidates a refresh token family by its family ID.
   * @param familyId - The family ID to be invalidated.
   */
  invalidateFamilyById(familyId: string): Promise<void>;

  /**
   * Revokes the current refresh token and returns a new one, keeping the same family ID.
   * @param token - The token to be refreshed.
   * @returns The sanitized refresh token data.
   * @throws *`AppServerError`* If the token to be refreshed is not found or the refresh token
   * is still valid.
   */
  refresh(token: string): Promise<RefreshTokenResponseDTO>;

  /**
   * Deletes all refresh tokens of an user.
   * @param userId - The user ID to delete all refresh tokens.
   */
  deleteTokensByUserId(userId: EntityIdDTO): Promise<void>;

  /**
   * Deletes a refresh token.
   * @param token - The raw token string to be searched for.
   */
  delete(token: string): Promise<void>;
}
