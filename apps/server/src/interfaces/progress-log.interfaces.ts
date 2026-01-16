import type {
  HTTPRequest,
  HTTPResponse,
  ProgressLogCreateDTO,
  ProgressLogResponseDTO,
} from '@fokus/shared';
import type { ProgressLogDocument } from '../models/progress-log.model.js';

export interface IProgressLogRepository {
  create(progressLog: ProgressLogCreateDTO): Promise<ProgressLogDocument>;
}

export interface IProgressService {
  create(progressLog: ProgressLogCreateDTO): Promise<ProgressLogDocument>;
}

export interface IProgressLogController {
  create(
    req: HTTPRequest<ProgressLogCreateDTO>,
  ): Promise<HTTPResponse<ProgressLogResponseDTO>>;
}
