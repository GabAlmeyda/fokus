import type {
  EntityIdDTO,
  HabitStatsDTO,
  HTTPRequest,
  HTTPResponse,
  ProgressLogCreateDTO,
  ProgressLogFilterDTO,
  ProgressLogResponseDTO,
} from '@fokus/shared';
import type { ProgressLogDocument } from '../models/progress-log.model.js';

export interface IProgressLogRepository {
  create(progressLog: ProgressLogCreateDTO): Promise<ProgressLogDocument>;

  findOneById(
    progressLogId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<ProgressLogDocument | null>;

  findByFilter(
    filter: ProgressLogFilterDTO,
    userId: EntityIdDTO,
  ): Promise<ProgressLogDocument[]>;

  getEntityDates(
    userId: EntityIdDTO,
    entityType: 'habitId' | 'goalId',
    entityId?: EntityIdDTO,
  ): Promise<{ entityId: EntityIdDTO; dates: Date[] }[]>;

  delete(
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

  findByFilter(
    filter: ProgressLogFilterDTO,
    userId: EntityIdDTO,
  ): Promise<ProgressLogDocument[]>;

  getHabitStats(
    userId: EntityIdDTO,
    habitId?: EntityIdDTO,
  ): Promise<Record<EntityIdDTO, HabitStatsDTO>>;

  delete(progressLogId: EntityIdDTO, userId: EntityIdDTO): Promise<null>;
}

export interface IProgressLogController {
  create(
    req: HTTPRequest<ProgressLogCreateDTO>,
  ): Promise<HTTPResponse<ProgressLogResponseDTO>>;

  findOneById(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<ProgressLogResponseDTO>>;

  findByFilter(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<ProgressLogResponseDTO[]>>;

  delete(req: HTTPRequest<null>): Promise<HTTPResponse<null>>;
}
