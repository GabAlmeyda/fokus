import type { RegisterUserDTO } from 'packages/shared/dist/index.js';
import type { IUserRepository } from '../interfaces/user-interfaces.js';
import type { UserDocument } from '../models/user-model.js';
import { UserModel } from '../models/user-model.js';
import { MongoRepositoryError } from '../helpers/mongo-errors.js';

export class UserRepository implements IUserRepository {
  async registerUser(user: RegisterUserDTO): Promise<UserDocument> {
    try {
      const createdUser: UserDocument = await UserModel.create(user);

      return createdUser;
    } catch (err) {
      throw MongoRepositoryError.fromMongoose(err);
    }
  }
}
