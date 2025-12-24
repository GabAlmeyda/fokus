import {
  formatZodError,
  LoginUserSchema,
  RegisterUserSchema,
  UpdateUserSchema,
  type LoginUserDTO,
  type RegisterUserDTO,
  type TokenPayloadDTO,
  type UpdateUserDTO,
} from '@fokus/shared';
import type { UserDocument } from '../models/user-model.js';
import type { IUserService } from '../interfaces/user-interfaces.js';
import { UserRepository } from '../repositories/user-repository.js';
import { ServiceError } from '../helpers/service-errors.js';
import argon2 from 'argon2';
import { MongoRepositoryError } from '../helpers/mongo-errors.js';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export class UserService implements IUserService {
  private readonly userRepository = new UserRepository();

  async register(
    user?: RegisterUserDTO,
  ): Promise<{ userDoc: UserDocument; token: string }> {
    try {
      const validation = RegisterUserSchema.safeParse(user);
      if (!validation.success) {
        const { errorType, message, invalidFields } = formatZodError(
          validation.error,
        );

        throw new ServiceError(errorType, message, invalidFields);
      }

      const hashedPassword = await argon2.hash(validation.data.password);
      const registerUserData = { ...validation.data, password: hashedPassword };

      const registeredUserDoc =
        await this.userRepository.register(registerUserData);

      const JWT_SECRET = process.env.JWT_SECRET as string;
      const tokenPayload: TokenPayloadDTO = {
        id: registeredUserDoc._id.toString(),
        email: registeredUserDoc.email,
      };
      const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '15m' });

      return { userDoc: registeredUserDoc, token };
    } catch (err) {
      if (err instanceof MongoRepositoryError || err instanceof ServiceError) {
        throw new ServiceError(err.errorType, err.message, err.invalidFields);
      }

      throw new ServiceError('INTERNAL_SERVER_ERROR', 'Unexpected error.');
    }
  }

  async login(
    user?: LoginUserDTO,
  ): Promise<{ userDoc: UserDocument; token: string }> {
    try {
      const validation = LoginUserSchema.safeParse(user);
      if (!validation.success) {
        const { errorType, message, invalidFields } = formatZodError(
          validation.error,
        );

        throw new ServiceError(errorType, message, invalidFields);
      }

      const loggedUserDoc = await this.userRepository.findOneByEmail(
        validation.data.email,
      );
      if (!loggedUserDoc) {
        throw new ServiceError('UNAUTHORIZED', 'Incorret email or password.', [
          { field: 'email', message: 'Email may be incorrect.' },
          { field: 'password', message: 'Password may be incorrect.' },
        ]);
      }

      const verify = await argon2.verify(
        loggedUserDoc.password,
        validation.data.password,
      );
      if (!verify) {
        throw new ServiceError('UNAUTHORIZED', 'Incorret email or password.', [
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
    } catch (err) {
      if (err instanceof MongoRepositoryError || err instanceof ServiceError) {
        throw new ServiceError(err.errorType, err.message, err.invalidFields);
      }

      throw new ServiceError('INTERNAL_SERVER_ERROR', 'Unexpected error.');
    }
  }

  async findOneById(userId?: string): Promise<UserDocument> {
    try {
      if (typeof userId !== 'string' || !Types.ObjectId.isValid(userId)) {
        throw new ServiceError('BAD_REQUEST', 'Invalid ID provided.');
      }

      const userDoc = await this.userRepository.findOneById(userId);
      if (!userDoc) {
        throw new ServiceError(
          'NOT_FOUND',
          `User with ID '${userId}' not found.`,
        );
      }

      return userDoc;
    } catch (err) {
      if (err instanceof MongoRepositoryError || err instanceof ServiceError) {
        throw new ServiceError(err.errorType, err.message, err.invalidFields);
      }

      throw new ServiceError('INTERNAL_SERVER_ERROR', 'Unexpected error.');
    }
  }

  async update(
    userId?: string,
    newData?: UpdateUserDTO,
  ): Promise<UserDocument> {
    try {
      if (typeof userId !== 'string' || !Types.ObjectId.isValid(userId)) {
        throw new ServiceError('BAD_REQUEST', 'Invalid ID provided.');
      }

      const validation = UpdateUserSchema.safeParse(newData);
      if (!validation.success) {
        const { errorType, message, invalidFields } = formatZodError(
          validation.error,
        );

        throw new ServiceError(errorType, message, invalidFields);
      }

      const updatedUserDoc = await this.userRepository.update(
        userId,
        validation.data,
      );

      if (!updatedUserDoc) {
        throw new ServiceError(
          'NOT_FOUND',
          `User with ID '${userId}' not found.`,
        );
      }

      return updatedUserDoc;
    } catch (err) {
      if (err instanceof MongoRepositoryError || err instanceof ServiceError) {
        throw new ServiceError(err.errorType, err.message, err.invalidFields);
      }

      throw new ServiceError('INTERNAL_SERVER_ERROR', 'Unexpected error');
    }
  }

  async delete(userId?: string): Promise<UserDocument> {
    try {
      if (typeof userId !== 'string' || !Types.ObjectId.isValid(userId)) {
        throw new ServiceError('BAD_REQUEST', 'Invalid ID provided.');
      }

      const deletedUserDoc = await this.userRepository.delete(userId);
      if (!deletedUserDoc) {
        throw new ServiceError(
          'NOT_FOUND',
          `User with ID '${userId}' not found.`,
        );
      }

      return deletedUserDoc;
    } catch (err) {
      if (err instanceof MongoRepositoryError || err instanceof ServiceError) {
        throw new ServiceError(err.errorType, err.message, err.invalidFields);
      }

      throw new ServiceError('INTERNAL_SERVER_ERROR', 'Unexpected error.');
    }
  }
}
