import type { CreateGoalDTO, GoalFilterDTO, MongoIdDTO } from '@fokus/shared';
import type { IGoalRepository } from '../interfaces/goal-interfaces.js';
import { GoalModel, type GoalDocument } from '../models/goal-model.js';
import { MongoRepositoryError } from '../helpers/mongo-repository-error.js';
import { Types } from 'mongoose';
import { startOfWeek, endOfWeek } from 'date-fns';

export class GoalRepository implements IGoalRepository {
  async create(
    goal: CreateGoalDTO & { currentValue: number | null },
  ): Promise<GoalDocument> {
    try {
      const goalToCreate = {
        ...goal,
        categoryId: goal.categoryId
          ? new Types.ObjectId(goal.categoryId)
          : null,
        habits: goal.habits.map((h) => new Types.ObjectId(h)),
      };
      const createdGoalDoc = await GoalModel.create(goalToCreate);

      return createdGoalDoc;
    } catch (err) {
      throw MongoRepositoryError.fromMongoose(err);
    }
  }

  async findAll(userId: MongoIdDTO): Promise<GoalDocument[]> {
    try {
      const goalDocs = await GoalModel.find({ userId });

      return goalDocs;
    } catch (err) {
      throw MongoRepositoryError.fromMongoose(err);
    }
  }

  async findOneById(
    goalId: MongoIdDTO,
    userId: MongoIdDTO,
  ): Promise<GoalDocument | null> {
    try {
      const goalDoc = await GoalModel.findOne({ _id: goalId, userId });

      return goalDoc;
    } catch (err) {
      throw MongoRepositoryError.fromMongoose(err);
    }
  }

  async findByFilter(
    filter: GoalFilterDTO,
    userId: MongoIdDTO,
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
        const ret = await GoalModel.find(query);
        return ret;
      }

      switch (property) {
        case 'title':
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

      const ret = await GoalModel.find(query);
      return ret;
    } catch (err) {
      throw MongoRepositoryError.fromMongoose(err);
    }
  }
}
