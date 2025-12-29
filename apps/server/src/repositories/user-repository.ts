import type { MongoIdDTO, RegisterUserDTO, UpdateUserDTO } from '@fokus/shared';
import type { IUserRepository } from '../interfaces/user-interfaces.js';
import type { UserDocument } from '../models/user-model.js';
import { UserModel } from '../models/user-model.js';
import { MongoRepositoryError } from '../helpers/mongo-repository-error.js';
import { Types } from 'mongoose';

export class UserRepository implements IUserRepository {
  async register(user: RegisterUserDTO): Promise<UserDocument> {
    try {
      const createdUserDoc: UserDocument = await UserModel.create(user);

      return createdUserDoc;
    } catch (err) {
      throw MongoRepositoryError.fromMongoose(err);
    }
  }

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    try {
      const loggedUserDoc: UserDocument | null = await UserModel.findOne({
        email,
      }).select('+password');

      return loggedUserDoc;
    } catch (err) {
      throw MongoRepositoryError.fromMongoose(err);
    }
  }

  async findOneById(userId: MongoIdDTO): Promise<UserDocument | null> {
    try {
      const id = new Types.ObjectId(userId);
      const userDoc: UserDocument | null = await UserModel.findById(id);

      return userDoc;
    } catch (err) {
      throw MongoRepositoryError.fromMongoose(err);
    }
  }

  async update(
    userId: MongoIdDTO,
    newData: UpdateUserDTO,
  ): Promise<UserDocument | null> {
    try {
      const id = new Types.ObjectId(userId);
      const updatedUserDoc: UserDocument | null =
        await UserModel.findOneAndUpdate(
          { _id: id },
          { $set: newData },
          {
            new: true,
            runValidators: true,
          },
        );

      return updatedUserDoc;
    } catch (err) {
      throw MongoRepositoryError.fromMongoose(err);
    }
  }

  async delete(userId: MongoIdDTO): Promise<UserDocument | null> {
    try {
      const id = new Types.ObjectId(userId);
      const deletedUserDoc: UserDocument | null =
        await UserModel.findOneAndDelete({ _id: id });

      return deletedUserDoc;
    } catch (err) {
      throw MongoRepositoryError.fromMongoose(err);
    }
  }
}
