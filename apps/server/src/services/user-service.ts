import {
  type LoginUserDTO,
  type RegisterUserDTO,
  type TokenPayload,
  isLoginUserDTO,
  validateLoginUserData,
  isRegisterUserDTO,
  validateRegisterUserData,
} from '@fokus/shared';
import type { UserDocument } from '../models/user-model.js';
import type { IUserService } from '../interfaces/user-interfaces.js';
import { UserRepository } from '../repositories/user-repository.js';
import { ServiceError } from '../helpers/service-errors.js';
import argon2 from 'argon2';
import { MongoRepositoryError } from '../helpers/mongo-errors.js';
import jwt from 'jsonwebtoken';

export class UserService implements IUserService {
  private readonly userRepository = new UserRepository();

  async registerUser(
    user?: RegisterUserDTO,
  ): Promise<{ userDoc: UserDocument; token: string }> {
    if (!isRegisterUserDTO(user)) {
      throw new ServiceError('BAD_REQUEST', 'Invalid payload provided.');
    }

    const invalidFields = validateRegisterUserData(user);
    if (invalidFields.length !== 0) {
      throw new ServiceError(
        'UNPROCESSABLE',
        'Invalid data provided.',
        invalidFields,
      );
    }

    const hashedPassword = await argon2.hash(user.password);
    const registerUserData = { ...user, password: hashedPassword };

    try {
      const createdUserDoc =
        await this.userRepository.registerUser(registerUserData);

      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) {
        console.error(
          "[user-service (server)] JWT secret not defined in the '.env' file",
        );
        process.exit(1);
      }
      const tokenPayload: TokenPayload = {
        id: createdUserDoc._id.toString(),
        email: createdUserDoc.email,
      };
      const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '15m' });

      return { userDoc: createdUserDoc, token };
    } catch (err) {
      if (err instanceof MongoRepositoryError) {
        throw new ServiceError(err.errorType, err.message, err.invalidFields);
      }

      throw new ServiceError('INTERNAL_SERVER_ERROR', 'Unexpected error.');
    }
  }

  async loginUser(
    user?: LoginUserDTO,
  ): Promise<{ userDoc: UserDocument; token: string }> {
    if (!isLoginUserDTO(user)) {
      throw new ServiceError('BAD_REQUEST', 'Invalid payload provided.');
    }

    const invalidFields = validateLoginUserData(user);
    if (invalidFields.length !== 0) {
      throw new ServiceError(
        'UNPROCESSABLE',
        'Invalid data provided.',
        invalidFields,
      );
    }

    try {
      const loggedUserDoc = await this.userRepository.findByEmail(user.email);
      if (!loggedUserDoc) {
        throw new ServiceError('UNAUTHORIZED', 'Incorret email or password.', [
          { field: 'email', message: 'Email may be incorrect.' },
          { field: 'password', message: 'Password may be incorrect.' },
        ]);
      }

      const verify = await argon2.verify(loggedUserDoc.password, user.password);
      if (!verify) {
        throw new ServiceError('UNAUTHORIZED', 'Incorret email or password.', [
          { field: 'email', message: 'Email may be incorrect.' },
          { field: 'password', message: 'Password may be incorrect.' },
        ]);
      }

      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) {
        console.error(
          "[user-service (server)] JWT secret not defined in the '.env' file",
        );
        process.exit(1);
      }
      const tokenPayload: TokenPayload = {
        email: loggedUserDoc.email,
        id: loggedUserDoc._id.toString(),
      };
      const token = jwt.sign(tokenPayload, JWT_SECRET, {
        expiresIn: '15m',
      });

      return { userDoc: loggedUserDoc, token };
    } catch (err) {
      if (err instanceof MongoRepositoryError) {
        throw new ServiceError(err.errorType, err.message, err.invalidFields);
      }

      if (err instanceof ServiceError) {
        throw err;
      }

      throw new ServiceError('INTERNAL_SERVER_ERROR', 'Unexpected error.');
    }
  }
}
