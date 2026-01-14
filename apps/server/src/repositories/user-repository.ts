import type { MongoIdDTO, RegisterUserDTO, UpdateUserDTO } from '@fokus/shared';
import type { IUserRepository } from '../interfaces/user-interfaces.js';
import type { UserDocument } from '../models/user-model.js';
import { UserModel } from '../models/user-model.js';
import { DatabaseError } from '../helpers/database-error.js';

export class UserRepository implements IUserRepository {
  async register(user: RegisterUserDTO): Promise<UserDocument> {
    try {
      const createdUserDoc = await UserModel.create(user);

      return createdUserDoc;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    try {
      const loggedUserDoc = await UserModel.findOne({
        email,
      }).select('+password');

      return loggedUserDoc;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }

  async findOneById(userId: MongoIdDTO): Promise<UserDocument | null> {
    try {
      const userDoc = await UserModel.findById(userId);

      return userDoc;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }

  async update(
    userId: MongoIdDTO,
    newData: UpdateUserDTO,
  ): Promise<UserDocument | null> {
    try {
      const updatedUserDoc = await UserModel.findOneAndUpdate(
        { _id: userId },
        { $set: newData },
        {
          new: true,
          runValidators: true,
        },
      );

      return updatedUserDoc;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }

  async delete(userId: MongoIdDTO): Promise<UserDocument | null> {
    try {
      const deletedUserDoc = await UserModel.findOneAndDelete({ _id: userId });

      return deletedUserDoc;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }
}
