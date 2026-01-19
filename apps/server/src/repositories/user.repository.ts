import type {
  EntityIdDTO,
  UserRegisterDTO,
  UserUpdateDTO,
} from '@fokus/shared';
import type { IUserRepository } from '../interfaces/user.interfaces.js';
import type { UserDocument } from '../models/user.model.js';
import { UserModel } from '../models/user.model.js';
import { DatabaseError } from '../helpers/errors/database.errors.js';

export class UserRepository implements IUserRepository {
  async register(user: UserRegisterDTO): Promise<UserDocument> {
    try {
      const userDoc = await UserModel.create(user);

      return userDoc;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    try {
      const userDoc = await UserModel.findOne({
        email,
      }).select('+password');

      return userDoc;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }

  async findOneById(userId: EntityIdDTO): Promise<UserDocument | null> {
    try {
      const userDoc = await UserModel.findById(userId);

      return userDoc;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }

  async update(
    userId: EntityIdDTO,
    newData: UserUpdateDTO,
  ): Promise<UserDocument | null> {
    try {
      const userDoc = await UserModel.findOneAndUpdate(
        { _id: userId },
        { $set: newData },
        {
          new: true,
          runValidators: true,
        },
      );

      return userDoc;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }

  async delete(userId: EntityIdDTO): Promise<UserDocument | null> {
    try {
      const userDoc = await UserModel.findOneAndDelete({ _id: userId });

      return userDoc;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }
}
