import type {
  GoalCreateDTO,
  GoalFilterDTO,
  EntityIdDTO,
  GoalUpdateDTO,
} from '@fokus/shared';
import type { IGoalRepository } from '../interfaces/goal.interfaces.js';
import { GoalModel, type GoalDocument } from '../models/goal.model.js';
import { DatabaseError } from '../helpers/errors/database.errors.js';
import { startOfWeek, endOfWeek } from 'date-fns';

export class GoalRepository implements IGoalRepository {
  async create(newData: GoalCreateDTO): Promise<GoalDocument> {
    try {
      const goalDoc = await GoalModel.create(newData);

      return goalDoc;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }

  async findOneById(
    goalId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<GoalDocument | null> {
    try {
      const goalDoc = await GoalModel.findOne({ _id: goalId, userId });

      return goalDoc;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }

  async findByFilter(
    filter: GoalFilterDTO,
    userId: EntityIdDTO,
  ): Promise<GoalDocument[]> {
    try {
      const DEADLINE_TYPES_FILTER: Record<
        NonNullable<GoalFilterDTO['deadlineType']>,
        () => any // eslint-disable-line @typescript-eslint/no-explicit-any
      > = {
        'not-defined': () => null,
        'has-deadline': () => ({ $ne: null }),
        'this-week': () => {
          const now = new Date();
          return {
            $gte: startOfWeek(now, { weekStartsOn: 0 }),
            $lte: endOfWeek(now, { weekStartsOn: 0 }),
          };
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const query: Record<string, any> = { userId };
      const property = Object.keys(filter).find(
        (k) => typeof filter[k as keyof GoalFilterDTO] !== 'undefined',
      ) as keyof GoalFilterDTO | undefined;

      if (!property) {
        const goalDocs = await GoalModel.find(query);
        return goalDocs;
      }

      switch (property) {
        case 'title':
        case 'habitId':
          query[property] = filter[property];
          break;
        case 'categoryId':
          query.categoryId =
            filter[property] === 'none' ? null : filter[property];
          break;
        case 'deadlineType':
          query.deadline = DEADLINE_TYPES_FILTER[filter.deadlineType!]();
          break;
        default: {
          const exhaustedCheck: never = property;
          throw new Error(
            `[goal-repository.ts (server)] Unhandled case '${exhaustedCheck}'.`,
          );
        }
      }

      const goalDocs = await GoalModel.find(query);
      return goalDocs;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }

  async update(
    goalId: EntityIdDTO,
    newData: GoalUpdateDTO,
    userId: EntityIdDTO,
  ): Promise<GoalDocument | null> {
    try {
      const goalDoc = await GoalModel.findOneAndUpdate(
        { _id: goalId, userId },
        { $set: newData },
        { new: true, runValidators: true },
      );

      return goalDoc;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }

  async delete(
    goalId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<GoalDocument | null> {
    try {
      const goalDoc = await GoalModel.findOneAndDelete({
        _id: goalId,
        userId,
      });

      return goalDoc;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }
}
