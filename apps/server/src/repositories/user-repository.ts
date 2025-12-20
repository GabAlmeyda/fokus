import type { RegisterUserDTO, UpdateUserDTO } from '@fokus/shared';
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
      const userDoc: UserDocument | null = await UserModel.findById(userId);

      return userDoc;
    } catch (err) {
      throw MongoRepositoryError.fromMongoose(err);
    }
  }

  async updateUser(
    userId: Types.ObjectId,
    newData: UpdateUserDTO,
  ): Promise<UserDocument | null> {
    try {
      const updatedUserDoc: UserDocument | null =
        await UserModel.findOneAndUpdate(
          { _id: userId },
          { $set: newData },
          {
            new: true,
          },
        );

      return updatedUserDoc;
    } catch (err) {
      throw MongoRepositoryError.fromMongoose(err);
    }
  }

  async deleteUser(userId: Types.ObjectId): Promise<UserDocument | null> {
    try {
      const deletedUserDoc: UserDocument | null =
        await UserModel.findOneAndDelete({ _id: userId });

      return deletedUserDoc;
    } catch (err) {
      throw MongoRepositoryError.fromMongoose(err);
    }
  }
}
