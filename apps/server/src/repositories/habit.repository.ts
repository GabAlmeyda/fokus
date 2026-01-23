import type {
  HabitCreateDTO,
  HabitFilterDTO,
  EntityIdDTO,
  HabitUpdateDTO,
} from '@fokus/shared';
import type { IHabitRepository } from '../interfaces/habit.interfaces.js';
import { HabitModel, type HabitDocument } from '../models/habit.model.js';
import { DatabaseError } from '../helpers/errors/database.errors.js';

export class HabitRepository implements IHabitRepository {
  async create(habit: HabitCreateDTO): Promise<HabitDocument> {
    try {
      const doc = await HabitModel.create(habit);

      return doc;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }

  async findOneById(
    habitId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<HabitDocument | null> {
    try {
      const doc = await HabitModel.findOne({
        _id: habitId,
        userId,
      });

      return doc;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }

  async findByFilter(
    filter: HabitFilterDTO,
    userId: EntityIdDTO,
  ): Promise<HabitDocument[]> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const query: Record<string, any> = { userId };

      const prop = Object.keys(filter).find(
        (k) => typeof filter[k as keyof HabitFilterDTO] !== 'undefined',
      ) as keyof HabitFilterDTO | undefined;
      if (!prop) {
        const ret = await HabitModel.find(query);
        return ret;
      }

      switch (prop) {
        case 'title':
          query[prop] = filter[prop];
          break;
        case 'weekDay':
          query.weekDays = filter[prop];
          break;
        default: {
          const exhaustedCheck: never = prop;
          throw new Error(
            `[habit-repository.ts (server)] Unhandled case '${exhaustedCheck}'.`,
          );
        }
      }

      const docs = await HabitModel.find(query);
      return docs;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }

  async update(
    habitId: EntityIdDTO,
    newData: HabitUpdateDTO,
    userId: EntityIdDTO,
  ): Promise<HabitDocument | null> {
    try {
      const doc = await HabitModel.findOneAndUpdate(
        { _id: habitId, userId },
        { $set: newData },
        { new: true, runValidators: true },
      );

      return doc;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }

  async delete(
    habitId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<HabitDocument | null> {
    try {
      const doc = await HabitModel.findOneAndDelete({
        _id: habitId,
        userId,
      });

      return doc;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }
}
