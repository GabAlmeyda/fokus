import type { CreateHabitDTO } from '@fokus/shared';
import type { IHabitRepository } from '../interfaces/habit-interfaces.js';
import { HabitModel, type HabitDocument } from '../models/habit-model.js';
import { MongoRepositoryError } from '../helpers/mongo-errors.js';

export class HabitRepository implements IHabitRepository {
  async create(habit: CreateHabitDTO): Promise<HabitDocument> {
    try {
      const createdHabitDoc: HabitDocument = await HabitModel.create(habit);

      return createdHabitDoc;
    } catch (err) {
      throw MongoRepositoryError.fromMongoose(err);
    }
  }
}
