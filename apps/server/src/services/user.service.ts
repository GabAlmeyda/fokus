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
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { mapUserDocToPublicDTO } from '../helpers/mappers.js';

export class UserService implements IUserService {
  private readonly userRepository;
  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async register(registerData: UserRegisterDTO): Promise<AuthResponseDTO> {
    const hashedPassword = await argon2.hash(registerData.password);
    const hashedRegisterData = { ...registerData, password: hashedPassword };

    const userDoc = await this.userRepository.register(hashedRegisterData);

    const JWT_SECRET = process.env.JWT_SECRET as string;
    const tokenPayload: TokenPayloadDTO = {
      id: userDoc._id.toString(),
      email: userDoc.email,
    };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

    const user = mapUserDocToPublicDTO(userDoc);
    return { user, token };
  }

  async login(loginData: UserLoginDTO): Promise<AuthResponseDTO> {
    const userDoc = await this.userRepository.findOneByEmail(loginData.email);
    if (!userDoc) {
      throw new AppServerError('UNAUTHORIZED', 'Incorret email or password.', [
        { field: 'email', message: 'Email may be incorrect.' },
        { field: 'password', message: 'Password may be incorrect.' },
      ]);
    }

    const verify = await argon2.verify(userDoc.password, loginData.password);
    if (!verify) {
      throw new AppServerError('UNAUTHORIZED', 'Incorret email or password.', [
        { field: 'email', message: 'Email may be incorrect.' },
        { field: 'password', message: 'Password may be incorrect.' },
      ]);
    }

    const JWT_SECRET = process.env.JWT_SECRET as string;
    const tokenPayload: TokenPayloadDTO = {
      email: userDoc.email,
      id: userDoc._id.toString(),
    };
    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: '7d',
    });

    const user = mapUserDocToPublicDTO(userDoc);
    return { user, token };
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
