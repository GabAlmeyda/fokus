import type { ProgressLogCreateDTO } from '@fokus/shared';
import type { IProgressService } from '../interfaces/progress-log.interfaces.js';
import type { ProgressLogDocument } from '../models/progress-log.model.js';
import { ProgressLogRepository } from '../repositories/progress-log.repository.js';

export class ProgressLogService implements IProgressService {
  private readonly progressLogRepository = new ProgressLogRepository();

  async create(
    progressLog: ProgressLogCreateDTO,
  ): Promise<ProgressLogDocument> {
    const createdProgressLogDoc =
      await this.progressLogRepository.create(progressLog);

    return createdProgressLogDoc;
  }
}
