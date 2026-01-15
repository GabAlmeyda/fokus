import {
  type UserLoginDTO,
  type EntityIdDTO,
  type UserRegisterDTO,
  type TokenPayloadDTO,
  type UserUpdateDTO,
} from '@fokus/shared';
import type { UserDocument } from '../models/user.model.js';
import type { IUserService } from '../interfaces/user.interfaces.js';
import { UserRepository } from '../repositories/user.repository.js';
import { AppServerError } from '../helpers/errors/app-server.errors.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

export class UserService implements IUserService {
  private readonly userRepository = new UserRepository();

  async register(
    user: UserRegisterDTO,
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
    user: UserLoginDTO,
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

  async findOneById(userId: EntityIdDTO): Promise<UserDocument> {
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
    userId: EntityIdDTO,
    newData: UserUpdateDTO,
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

  async delete(userId: EntityIdDTO): Promise<void> {
    const deletedUserDoc = await this.userRepository.delete(userId);
    if (!deletedUserDoc) {
      throw new AppServerError(
        'NOT_FOUND',
        `User with ID '${userId}' not found.`,
      );
    }
  }
}
