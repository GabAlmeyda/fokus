import type {
  CreateHabitDTO,
  MongoIdDTO,
  UpdateHabitDTO,
  WeekDayDTO,
} from '@fokus/shared';
import type { IHabitRepository } from '../interfaces/habit-interfaces.js';
import { HabitModel, type HabitDocument } from '../models/habit-model.js';
import { MongoRepositoryError } from '../helpers/mongo-repository-error.js';

export class HabitRepository implements IHabitRepository {
  async create(habit: CreateHabitDTO): Promise<HabitDocument> {
    try {
      const createdHabitDoc = await HabitModel.create(habit);

      return createdHabitDoc;
    } catch (err) {
      throw MongoRepositoryError.fromMongoose(err);
    }
  }

  async findOneByTitle(
    title: string,
    userId: MongoIdDTO,
  ): Promise<HabitDocument | null> {
    try {
      const habitDoc = await HabitModel.findOne({ title, userId });

      return habitDoc;
    } catch (err) {
      throw MongoRepositoryError.fromMongoose(err);
    }
  }

  async findOneById(
    habitId: MongoIdDTO,
    userId: MongoIdDTO,
  ): Promise<HabitDocument | null> {
    try {
      const habitDoc = await HabitModel.findOne({
        _id: habitId,
        userId,
      });

      return habitDoc;
    } catch (err) {
      throw MongoRepositoryError.fromMongoose(err);
    }
  }

  async findAll(userId: MongoIdDTO): Promise<HabitDocument[]> {
    try {
      const habitDocs = await HabitModel.find({ userId });

      return habitDocs;
    } catch (err) {
      throw MongoRepositoryError.fromMongoose(err);
    }
  }

  async findAllByWeekDay(
    day: WeekDayDTO,
    userId: MongoIdDTO,
  ): Promise<HabitDocument[]> {
    try {
      const habitDocs = await HabitModel.find({ weekDays: day, userId });

      return habitDocs;
    } catch (err) {
      throw MongoRepositoryError.fromMongoose(err);
    }
  }

  async update(
    habitId: MongoIdDTO,
    newData: UpdateHabitDTO,
    userId: MongoIdDTO,
  ): Promise<HabitDocument | null> {
    try {
      const updatedHabitDoc = await HabitModel.findOneAndUpdate(
        { _id: habitId, userId },
        { $set: newData },
        { new: true, runValidators: true },
      );

      return updatedHabitDoc;
    } catch (err) {
      throw MongoRepositoryError.fromMongoose(err);
    }
  }

  async delete(
    habitId: MongoIdDTO,
    userId: MongoIdDTO,
  ): Promise<HabitDocument | null> {
    try {
      const deletedHabitDoc = await HabitModel.findOneAndDelete({
        _id: habitId,
        userId,
      });

      return deletedHabitDoc;
    } catch (err) {
      throw MongoRepositoryError.fromMongoose(err);
    }
  }
}
