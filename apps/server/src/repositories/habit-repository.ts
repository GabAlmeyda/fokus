import type { CreateHabitDTO } from '@fokus/shared';
import type { IHabitRepository } from '../interfaces/habit-interfaces.js';
import { HabitModel, type HabitDocument } from '../models/habit-model.js';
import { MongoRepositoryError } from '../helpers/mongo-errors.js';

export class HabitRepository implements IHabitRepository {
  async create(habit: CreateHabitDTO): Promise<HabitDocument> {
    try {
      const createdHabitDoc = await HabitModel.create(habit);

      return createdHabitDoc;
    } catch (err) {
      throw MongoRepositoryError.fromMongoose(err);
    }
  }

  async findOneById(
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
}
