import type { EntityIdDTO, ProgressLogCreateDTO } from '@fokus/shared';
import type { IProgressLogRepository } from '../interfaces/progress-log.interfaces.js';
import {
  ProgressLogModel,
  type ProgressLogDocument,
} from '../models/progress-log.model.js';
import { DatabaseError } from '../helpers/errors/database.errors.js';

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
}
