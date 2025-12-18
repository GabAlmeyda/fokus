import type { RegisterUserDTO } from '@fokus/shared';
import type { IUserRepository } from '../interfaces/user-interfaces.js';
import type { UserDocument } from '../models/user-model.js';
import { UserModel } from '../models/user-model.js';
import { MongoRepositoryError } from '../helpers/mongo-errors.js';
import { Types } from 'mongoose';

export class UserRepository implements IUserRepository {
  async registerUser(user: RegisterUserDTO): Promise<UserDocument> {
    try {
      const createdUserDoc: UserDocument = await UserModel.create(user);

      return createdUserDoc;
    } catch (err) {
      throw MongoRepositoryError.fromMongoose(err);
    }
  }

  async findUserByEmail(email: string): Promise<UserDocument | null> {
    try {
      const loggedUserDoc: UserDocument | null = await UserModel.findOne({
        email,
      }).select('+password');

      return loggedUserDoc;
    } catch (err) {
      throw MongoRepositoryError.fromMongoose(err);
    }
  }

  async findUserById(userId: Types.ObjectId): Promise<UserDocument | null> {
    try {
      const user: UserDocument | null = await UserModel.findById(userId);

      return user;
    } catch (err) {
      throw MongoRepositoryError.fromMongoose(err);
    }
  }
}
