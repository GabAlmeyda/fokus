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
  create(newData: ProgressLogCreateDTO): Promise<ProgressLogDocument>;

  findOneById(
    progressLogId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<ProgressLogDocument | null>;

  findByFilter(
    filter: ProgressLogFilterDTO,
    userId: EntityIdDTO,
  ): Promise<ProgressLogDocument[]>;

  getEntityDates(
    entityType: 'habitId' | 'goalId',
    userId: EntityIdDTO,
    entityId?: EntityIdDTO,
  ): Promise<{ entityId: EntityIdDTO; dates: Date[] }[]>;

  getGoalCurrentValues(
    userId: EntityIdDTO,
    goalId?: EntityIdDTO,
  ): Promise<{ goalId: EntityIdDTO; currentValue: number }[]>;

  delete(
    progressLogId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<ProgressLogDocument | null>;
}

export interface IProgressLogService {
  create(newData: ProgressLogCreateDTO): Promise<ProgressLogResponseDTO>;

  findOneById(
    progressLogId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<ProgressLogResponseDTO>;

  findByFilter(
    filter: ProgressLogFilterDTO,
    userId: EntityIdDTO,
  ): Promise<ProgressLogResponseDTO[]>;

  getHabitActivityStats(
    userId: EntityIdDTO,
    habitId?: EntityIdDTO,
  ): Promise<Record<EntityIdDTO, HabitStatsDTO>>;

  getGoalActivityStats(
    userId: EntityIdDTO,
    goalId?: EntityIdDTO,
  ): Promise<Record<EntityIdDTO, number>>;

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
