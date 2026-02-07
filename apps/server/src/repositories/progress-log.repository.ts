import type {
  EntityIdDTO,
  ProgressLogCreateDTO,
  ProgressLogFilterDTO,
} from '@fokus/shared';
import type { IProgressLogRepository } from '../interfaces/progress-log.interfaces.js';
import {
  ProgressLogModel,
  type ProgressLogDocument,
} from '../models/progress-log.model.js';
import { DatabaseError } from '../helpers/errors/database.errors.js';
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { Types } from 'mongoose';
import type { ProgressLogDeleteDTO } from '../types/progress-log.types.js';

export class ProgressLogRepository implements IProgressLogRepository {
  async create(newData: ProgressLogCreateDTO): Promise<ProgressLogDocument> {
    try {
      const progressLogDoc = await ProgressLogModel.create(newData);

      return progressLogDoc;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }

  async findOneById(
    progressLogId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<ProgressLogDocument | null> {
    try {
      const progressLogDoc = await ProgressLogModel.findOne({
        _id: progressLogId,
        userId,
      });

      return progressLogDoc;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }

  async findByFilter(
    filter: ProgressLogFilterDTO,
    userId: EntityIdDTO,
  ): Promise<ProgressLogDocument[]> {
    try {
      const PERIOD_MAP: Record<
        NonNullable<ProgressLogFilterDTO['period']>['interval'],
        (date: Date) => { $gte: Date; $lte: Date }
      > = {
        daily: (date: Date) => ({
          $gte: startOfDay(date),
          $lte: endOfDay(date),
        }),
        weekly: (date: Date) => ({
          $gte: startOfWeek(date, { weekStartsOn: 0 }),
          $lte: endOfWeek(date, { weekStartsOn: 0 }),
        }),
        monthly: (date: Date) => ({
          $gte: startOfMonth(date),
          $lte: endOfMonth(date),
        }),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const query: Record<string, any> = { userId };
      const entityId = filter.entityId;
      const entityType = filter.entityType;
      const period = filter.period;

      if (entityId) {
        query[filter.entityType!] = filter.entityId;
      }
      if (entityType && !entityId) {
        query[filter.entityType!] = { $ne: null };
      }
      if (period) {
        query.date = PERIOD_MAP[filter.period!.interval](filter.period!.date);
      }

      const progressLogDocs = await ProgressLogModel.find(query);
      return progressLogDocs;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }

  async getEntityDates(
    entityType: 'habitId' | 'goalId',
    userId: EntityIdDTO,
    entityId?: EntityIdDTO,
  ): Promise<{ entityId: EntityIdDTO; dates: Date[] }[]> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const matchQuery: any = { userId: new Types.ObjectId(userId) };
      if (entityId) {
        matchQuery[entityType] = new Types.ObjectId(entityId);
      } else {
        matchQuery[entityType] = { $exists: true, $ne: null };
      }

      const entityDates: { entityId: EntityIdDTO; dates: Date[] }[] =
        await ProgressLogModel.aggregate([
          {
            $match: matchQuery,
          },

          {
            $group: {
              _id: `$${entityType}`,
              dates: { $addToSet: '$date' },
            },
          },

          {
            $project: {
              entityId: { $toString: '$_id' },
              _id: 0,
              dates: {
                $sortArray: { input: '$dates', sortBy: -1 },
              },
            },
          },
        ]);

      return entityDates;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }

  async getGoalCurrentValues(
    userId: EntityIdDTO,
    goalId?: EntityIdDTO,
  ): Promise<{ goalId: EntityIdDTO; currentValue: number }[]> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const matchQuery: any = { userId: new Types.ObjectId(userId) };
      if (goalId) {
        matchQuery.goalId = new Types.ObjectId(goalId);
      } else {
        matchQuery.goalId = { $exists: true, $ne: null };
      }

      const currentValues: { goalId: EntityIdDTO; currentValue: number }[] =
        await ProgressLogModel.aggregate([
          {
            $match: matchQuery,
          },
          {
            $group: {
              _id: '$goalId',
              currentValue: { $sum: '$value' },
            },
          },
          {
            $project: {
              goalId: { $toString: '$_id' },
              _id: 0,
              currentValue: 1,
            },
          },
          {
            $sort: { currentValue: -1 },
          },
        ]);

      return currentValues;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }

  async delete(
    progressLogId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<ProgressLogDocument | null> {
    try {
      const progressLogDoc = await ProgressLogModel.findOneAndDelete({
        _id: progressLogId,
        userId,
      });

      return progressLogDoc;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }

  async deleteByFilter(
    filter: ProgressLogDeleteDTO,
    userId: EntityIdDTO,
  ): Promise<ProgressLogDocument | null> {
    try {
      const progressLogDoc = await ProgressLogModel.findOneAndDelete({
        [filter.entityType]: filter.entityId,
        date: filter.date,
        userId,
      });

      return progressLogDoc;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }
}
