import {
  type RegisterUserDTO,
  validateRegisterUserDTO,
  validateRegisterUserData,
} from '@fokus/shared';
import type { UserDocument } from '../models/user-model.js';
import type { IUserService } from '../interfaces/user-interfaces.js';
import { UserRepository } from '../repositories/user-repository.js';
import { ServiceError } from '../helpers/service-errors.js';

export class UserService implements IUserService {
  private readonly userRepository = new UserRepository();

  async registerUser(user?: RegisterUserDTO): Promise<UserDocument> {
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

    try {
      const userDoc = await this.userRepository.registerUser(user);
      return userDoc;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      throw new ServiceError(err.errorType, err.message, err.invalidFields);
    }
  }
}
