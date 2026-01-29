import { mapRefreskTokenDocToPublicDTO } from '../helpers/mappers.js';
import type {
  IRefreshTokenRepository,
  IRefreshTokenService,
} from '../interfaces/refresh-token.interfaces.js';
import type {
  RefreshTokenCreateDTO,
  RefreshTokenResponseDTO,
} from '../types/refresh-token.types.js';

export class RefreshTokenService implements IRefreshTokenService {
  private readonly refreshTokenRepository;
  constructor(refreshTokenRepository: IRefreshTokenRepository) {
    this.refreshTokenRepository = refreshTokenRepository;
  }

  async create(
    newData: RefreshTokenCreateDTO,
  ): Promise<RefreshTokenResponseDTO> {
    const tokenDoc = await this.refreshTokenRepository.create(newData);
    const token = mapRefreskTokenDocToPublicDTO(tokenDoc);

    return token;
  }
}
