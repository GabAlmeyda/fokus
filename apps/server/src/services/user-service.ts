import {
  type LoginUserDTO,
  type MongoIdDTO,
  type RegisterUserDTO,
  type TokenPayloadDTO,
  type UpdateUserDTO,
} from '@fokus/shared';
import type { UserDocument } from '../models/user-model.js';
import type { IUserService } from '../interfaces/user-interfaces.js';
import { UserRepository } from '../repositories/user-repository.js';
import { AppServerError } from '../helpers/app-server-error.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

export class UserService implements IUserService {
  private readonly userRepository = new UserRepository();

  async register(
    user: RegisterUserDTO,
  ): Promise<{ userDoc: UserDocument; token: string }> {
    const hashedPassword = await argon2.hash(user.password);
    const registerUserData = { ...user, password: hashedPassword };

    const registeredUserDoc =
      await this.userRepository.register(registerUserData);

    const JWT_SECRET = process.env.JWT_SECRET as string;
    const tokenPayload: TokenPayloadDTO = {
      id: registeredUserDoc._id.toString(),
      email: registeredUserDoc.email,
    };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '15m' });

    return { userDoc: registeredUserDoc, token };
  }

  async login(
    user: LoginUserDTO,
  ): Promise<{ userDoc: UserDocument; token: string }> {
    const loggedUserDoc = await this.userRepository.findOneByEmail(user.email);
    if (!loggedUserDoc) {
      throw new AppServerError('UNAUTHORIZED', 'Incorret email or password.', [
        { field: 'email', message: 'Email may be incorrect.' },
        { field: 'password', message: 'Password may be incorrect.' },
      ]);
    }

    const verify = await argon2.verify(loggedUserDoc.password, user.password);
    if (!verify) {
      throw new AppServerError('UNAUTHORIZED', 'Incorret email or password.', [
        { field: 'email', message: 'Email may be incorrect.' },
        { field: 'password', message: 'Password may be incorrect.' },
      ]);
    }

    const JWT_SECRET = process.env.JWT_SECRET as string;
    const tokenPayload: TokenPayloadDTO = {
      email: loggedUserDoc.email,
      id: loggedUserDoc._id.toString(),
    };
    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: '15m',
    });

    return { userDoc: loggedUserDoc, token };
  }

  async findOneById(userId: MongoIdDTO): Promise<UserDocument> {
    const userDoc = await this.userRepository.findOneById(userId);
    if (!userDoc) {
      throw new AppServerError(
        'NOT_FOUND',
        `User with ID '${userId}' not found.`,
      );
    }

    return userDoc;
  }

  async update(
    userId: MongoIdDTO,
    newData: UpdateUserDTO,
  ): Promise<UserDocument> {
    const updatedUserDoc = await this.userRepository.update(userId, newData);
    if (!updatedUserDoc) {
      throw new AppServerError(
        'NOT_FOUND',
        `User with ID '${userId}' not found.`,
      );
    }

    return updatedUserDoc;
  }

  async delete(userId: MongoIdDTO): Promise<UserDocument> {
    const deletedUserDoc = await this.userRepository.delete(userId);
    if (!deletedUserDoc) {
      throw new AppServerError(
        'NOT_FOUND',
        `User with ID '${userId}' not found.`,
      );
    }

    return deletedUserDoc;
  }
}
