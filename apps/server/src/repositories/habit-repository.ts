import type {
  CreateHabitDTO,
  HabitFilterDTO,
  EntityIdDTO,
  UpdateHabitDTO,
} from '@fokus/shared';
import type { IHabitRepository } from '../interfaces/habit-interfaces.js';
import { HabitModel, type HabitDocument } from '../models/habit-model.js';
import { DatabaseError } from '../helpers/database-error.js';

export class HabitRepository implements IHabitRepository {
  async create(habit: CreateHabitDTO): Promise<HabitDocument> {
    try {
      const createdHabitDoc = await HabitModel.create(habit);

      return createdHabitDoc;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }

  async findOneById(
    habitId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<HabitDocument | null> {
    try {
      const habitDoc = await HabitModel.findOne({
        _id: habitId,
        userId,
      });

      return habitDoc;
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
          const exhaustedCheck: never = property;
          throw new Error(
            `[habit-repository.ts (server)] Unhandled case '${exhaustedCheck}'.`,
          );
        }
      }

      const habitDocs = await HabitModel.find(query);
      return habitDocs;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }

  async update(
    habitId: EntityIdDTO,
    newData: UpdateHabitDTO,
    userId: EntityIdDTO,
  ): Promise<HabitDocument | null> {
    try {
      const updatedHabitDoc = await HabitModel.findOneAndUpdate(
        { _id: habitId, userId },
        { $set: newData },
        { new: true, runValidators: true },
      );

      return updatedHabitDoc;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }

  async delete(
    habitId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<HabitDocument | null> {
    try {
      const deletedHabitDoc = await HabitModel.findOneAndDelete({
        _id: habitId,
        userId,
      });

      return deletedHabitDoc;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }
}
