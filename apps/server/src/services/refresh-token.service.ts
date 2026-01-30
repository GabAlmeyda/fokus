import { AppServerError } from '../helpers/errors/app-server.errors.js';
import { mapRefreshTokenDocToPublicDTO } from '../helpers/mappers.js';
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
    const token = mapRefreshTokenDocToPublicDTO(tokenDoc);

    return token;
  }

  async findOneByToken(token: string): Promise<RefreshTokenResponseDTO> {
    const tokenDoc = await this.refreshTokenRepository.findOneByToken(token);
    if (!tokenDoc) {
      throw new AppServerError(
        'NOT_FOUND',
        `Refresh token with token '${token}' not found.`,
        [{ field: 'token', message: 'Value not found.' }],
      );
    }

    const refreshToken = mapRefreshTokenDocToPublicDTO(tokenDoc);

    return refreshToken;
  }
}
