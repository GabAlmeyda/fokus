import type {
  EntityIdDTO,
  HTTPRequest,
  HTTPResponse,
  ProgressLogCreateDTO,
  ProgressLogResponseDTO,
} from '@fokus/shared';
import type { ProgressLogDocument } from '../models/progress-log.model.js';

export interface IProgressLogRepository {
  create(progressLog: ProgressLogCreateDTO): Promise<ProgressLogDocument>;

  findOneById(
    progressLogId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<ProgressLogDocument | null>;
}

export interface IProgressService {
  create(progressLog: ProgressLogCreateDTO): Promise<ProgressLogDocument>;

  findOneById(
    progressLogId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<ProgressLogDocument>;
}

export interface IProgressLogController {
  create(
    req: HTTPRequest<ProgressLogCreateDTO>,
  ): Promise<HTTPResponse<ProgressLogResponseDTO>>;

  findOneById(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<ProgressLogResponseDTO>>;
}
