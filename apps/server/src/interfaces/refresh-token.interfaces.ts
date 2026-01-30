import type { RefreshTokenDocument } from '../models/refresh-token.model.js';
import type {
  RefreshTokenCreateDTO,
  RefreshTokenResponseDTO,
} from '../types/refresh-token.types.js';

export interface IRefreshTokenRepository {
  create(newData: RefreshTokenCreateDTO): Promise<RefreshTokenDocument>;

  findOneByToken(token: string): Promise<RefreshTokenDocument | null>;
}

export interface IRefreshTokenService {
  create(newData: RefreshTokenCreateDTO): Promise<RefreshTokenResponseDTO>;

  findOneByToken(token: string): Promise<RefreshTokenResponseDTO>;
}
