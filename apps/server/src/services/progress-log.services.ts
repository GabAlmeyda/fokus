import type { EntityIdDTO, ProgressLogCreateDTO } from '@fokus/shared';
import type { IProgressService } from '../interfaces/progress-log.interfaces.js';
import type { ProgressLogDocument } from '../models/progress-log.model.js';
import { ProgressLogRepository } from '../repositories/progress-log.repository.js';
import { AppServerError } from '../helpers/errors/app-server.errors.js';

export class ProgressLogService implements IProgressService {
  private readonly progressLogRepository = new ProgressLogRepository();

  async create(
    progressLog: ProgressLogCreateDTO,
  ): Promise<ProgressLogDocument> {
    const createdProgressLogDoc =
      await this.progressLogRepository.create(progressLog);

    return createdProgressLogDoc;
  }

  async findOneById(
    progressLogId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<ProgressLogDocument> {
    const progressLogDoc = await this.progressLogRepository.findOneById(
      progressLogId,
      userId,
    );
    if (!progressLogDoc) {
      throw new AppServerError(
        'NOT_FOUND',
        `ProgressLog with ID '${progressLogId}' not found.`,
      );
    }

    return progressLogDoc;
  }
}
