import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import {
  type UserLoginDTO,
  type EntityIdDTO,
  type UserRegisterDTO,
  type TokenPayloadDTO,
  type UserUpdateDTO,
  type AuthResponseDTO,
  type UserResponseDTO,
} from '@fokus/shared';
import type {
  IUserRepository,
  IUserService,
} from '../interfaces/user.interfaces.js';
import { AppServerError } from '../helpers/errors/app-server.errors.js';
import { mapUserDocToPublicDTO } from '../helpers/mappers.js';
import type { IRefreshTokenService } from '../interfaces/refresh-token.interfaces.js';

export class UserService implements IUserService {
  private readonly userRepository;
  private readonly refreshTokenService;
  constructor(
    userRepository: IUserRepository,
    refreshTokenService: IRefreshTokenService,
  ) {
    this.userRepository = userRepository;
    this.refreshTokenService = refreshTokenService;
  }

  async register(registerData: UserRegisterDTO): Promise<AuthResponseDTO> {
    const hashedPassword = await argon2.hash(registerData.password);
    const hashedRegisterData = { ...registerData, password: hashedPassword };

    const userDoc = await this.userRepository.register(hashedRegisterData);
    const user = mapUserDocToPublicDTO(userDoc);

    const JWT_SECRET = process.env.JWT_SECRET as string;
    const accessTokenPayload: TokenPayloadDTO = {
      id: user.id,
      email: user.email,
    };
    const accessToken = jwt.sign(accessTokenPayload, JWT_SECRET, {
      expiresIn: '15m',
    });
    const refreshToken = await this.refreshTokenService.create({
      userId: user.id,
      familyId: randomUUID(),
    });

    return { user, accessToken, refreshToken: refreshToken.token };
  }

  async login(loginData: UserLoginDTO): Promise<AuthResponseDTO> {
    const userDoc = await this.userRepository.findOneByEmail(loginData.email);
    if (!userDoc) {
      throw new AppServerError('UNAUTHORIZED', 'Incorret email or password.', [
        { field: 'email', message: 'Email may be incorrect.' },
        { field: 'password', message: 'Password may be incorrect.' },
      ]);
    }
    const user = mapUserDocToPublicDTO(userDoc);

    const verify = await argon2.verify(userDoc.password, loginData.password);
    if (!verify) {
      throw new AppServerError('UNAUTHORIZED', 'Incorret email or password.', [
        { field: 'email', message: 'Email may be incorrect.' },
        { field: 'password', message: 'Password may be incorrect.' },
      ]);
    }

    const JWT_SECRET = process.env.JWT_SECRET as string;
    const accessTokenPayload: TokenPayloadDTO = {
      email: user.email,
      id: user.id,
    };
    const accessToken = jwt.sign(accessTokenPayload, JWT_SECRET, {
      expiresIn: '15m',
    });
    const refreshToken = await this.refreshTokenService.create({
      userId: user.id,
      familyId: randomUUID(),
    });

    return { user, accessToken, refreshToken: refreshToken.token };
  }

  async refreshToken(token: string): Promise<AuthResponseDTO> {
    const refToken = await this.refreshTokenService.refresh(token);

    const user = await this.findOneById(refToken.userId);

    const JWT_SECRET = process.env.JWT_SECRET as string;
    const accessTokenPayload: TokenPayloadDTO = {
      email: user.email,
      id: user.id,
    };
    const accessToken = jwt.sign(accessTokenPayload, JWT_SECRET, {
      expiresIn: '15m',
    });

    return { user, accessToken, refreshToken: refToken.token };
  }

  async findOneById(userId: EntityIdDTO): Promise<UserResponseDTO> {
    const userDoc = await this.userRepository.findOneById(userId);
    if (!userDoc) {
      throw new AppServerError(
        'NOT_FOUND',
        `User with ID '${userId}' not found.`,
      );
    }

    const user = mapUserDocToPublicDTO(userDoc);
    return user;
  }

  async update(
    userId: EntityIdDTO,
    newData: UserUpdateDTO,
  ): Promise<UserResponseDTO> {
    const userDoc = await this.userRepository.update(userId, newData);
    if (!userDoc) {
      throw new AppServerError(
        'NOT_FOUND',
        `User with ID '${userId}' not found.`,
      );
    }

    const user = mapUserDocToPublicDTO(userDoc);
    return user;
  }

  async delete(userId: EntityIdDTO): Promise<void> {
    const userDoc = await this.userRepository.delete(userId);
    if (!userDoc) {
      throw new AppServerError(
        'NOT_FOUND',
        `User with ID '${userId}' not found.`,
      );
    }
  }
}
