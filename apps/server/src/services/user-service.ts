import {
  type RegisterUserDTO,
  type TokenPayload,
  validateRegisterUserDTO,
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
    if (!validateRegisterUserDTO(user)) {
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
      const userDoc = await this.userRepository.registerUser(registerUserData);

      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) {
        console.error("JWT secret not defined in the '.env' file");
        process.exit(1);
      }
      const tokenPayload: TokenPayload = {
        id: userDoc._id.toString(),
        email: userDoc.email,
      };
      const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '15m' });

      return { userDoc, token };
    } catch (err) {
      if (err instanceof MongoRepositoryError) {
        throw new ServiceError(err.errorType, err.message, err.invalidFields);
      }

      throw new ServiceError('INTERNAL_SERVER_ERROR', 'Unexpected error.');
    }
  }
}
