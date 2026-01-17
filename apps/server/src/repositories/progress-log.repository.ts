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

export class ProgressLogRepository implements IProgressLogRepository {
  async create(
    progressLog: ProgressLogCreateDTO,
  ): Promise<ProgressLogDocument> {
    try {
      const createdProgressLogDoc = await ProgressLogModel.create(progressLog);

      return createdProgressLogDoc;
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
      const properties = Object.keys(filter).filter(
        (k) => typeof filter[k as keyof ProgressLogFilterDTO] !== 'undefined',
      ) as (keyof ProgressLogFilterDTO)[];

      if (properties.length === 0) {
        const progressLogDocs = await ProgressLogModel.find(query);
        return progressLogDocs;
      }

      for (const p of properties) {
        if (p === 'period') {
          query.date = PERIOD_MAP[filter.period!.interval](filter.period!.date);
        } else {
          query[p] = filter[p];
        }
      }

      const progressLogDocs = await ProgressLogModel.find(query);
      return progressLogDocs;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }
}
