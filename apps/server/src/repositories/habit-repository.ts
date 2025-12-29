import type { CreateHabitDTO, MongoIdDTO, WeekDayDTO } from '@fokus/shared';
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

  async findOneByTitleAndUser(
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

  async findOneByIdAndUser(
    habitId: string,
    userId: string,
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

  async findAllByUser(userId: string): Promise<HabitDocument[]> {
    try {
      const habitDocs = await HabitModel.find({ userId });

      return habitDocs;
    } catch (err) {
      throw MongoRepositoryError.fromMongoose(err);
    }
  }

  async findAllByWeekDayAndUser(
    day: WeekDayDTO,
    userId: string,
  ): Promise<HabitDocument[]> {
    try {
      const habitDocs = await HabitModel.find({ weekDays: day, userId });

      return habitDocs;
    } catch (err) {
      throw MongoRepositoryError.fromMongoose(err);
    }
  }
}
