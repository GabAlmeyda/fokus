import type {
  CreateHabitDTO,
  HabitFilterDTO,
  MongoIdDTO,
  UpdateHabitDTO,
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

  async findByFilter(
    filter: HabitFilterDTO,
    userId: MongoIdDTO,
  ): Promise<HabitDocument[]> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const query: Record<string, any> = { userId };
      const property = Object.keys(filter).find(
        (k) => typeof filter[k as keyof HabitFilterDTO] !== 'undefined',
      ) as keyof HabitFilterDTO | undefined;

      if (!property) {
        const ret = await HabitModel.find(query);
        return ret;
      }

      switch (property) {
        case 'title':
          query[property] = filter[property];
          break;
        case 'weekDay':
          query.weekDays = filter[property];
          break;
        default: {
          const _exhaustedCheck: never = property;
          throw new Error(
            `[habit-repository.ts (server)] Unhandled case ${_exhaustedCheck}.`,
          );
        }
      }

      console.log(query);

      const habitDocs = await HabitModel.find(query);
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
