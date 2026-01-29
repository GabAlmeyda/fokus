import type { RefreshTokenDocument } from '../models/refresh-token.model.js';
import type {
  RefreshTokenCreateDTO,
  RefreshTokenResponseDTO,
} from '../types/refresh-token.types.js';

export interface IRefreshTokenRepository {
  create(newData: RefreshTokenCreateDTO): Promise<RefreshTokenDocument>;
}

export interface IRefreshTokenService {
  create(newData: RefreshTokenCreateDTO): Promise<RefreshTokenResponseDTO>;
}
