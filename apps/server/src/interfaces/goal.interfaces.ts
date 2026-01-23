import type {
  GoalCreateDTO,
  GoalFilterDTO,
  HTTPRequest,
  HTTPResponse,
  EntityIdDTO,
  GoalResponseDTO,
  GoalUpdateDTO,
  GoalProgressEntryDTO,
} from '@fokus/shared';
import type { GoalDocument } from '../models/goal.model.js';

export interface IGoalRepository {
  create(newData: GoalCreateDTO): Promise<GoalDocument>;

  findOneById(
    goalId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<GoalDocument | null>;

  findByFilter(
    filter: GoalFilterDTO,
    userId: EntityIdDTO,
  ): Promise<GoalDocument[]>;

  update(
    goalId: EntityIdDTO,
    newData: GoalUpdateDTO,
    userId: EntityIdDTO,
  ): Promise<GoalDocument | null>;

  delete(
    goalId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<GoalDocument | null>;
}

export interface IGoalService {
  create(newData: GoalCreateDTO): Promise<GoalResponseDTO>;

  findOneById(
    goalId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<GoalResponseDTO>;

  findByFilter(
    filter: GoalFilterDTO,
    userId: EntityIdDTO,
  ): Promise<GoalResponseDTO[]>;

  update(
    goalId: EntityIdDTO,
    newData: GoalUpdateDTO,
    userId: EntityIdDTO,
  ): Promise<GoalResponseDTO>;

  delete(goalId: EntityIdDTO, userId: EntityIdDTO): Promise<void>;
}

export interface IGoalCompletionService {
  addProgressEntry(
    progressEntry: GoalProgressEntryDTO,
  ): Promise<GoalResponseDTO>;
}

export interface IGoalController {
  create(
    req: HTTPRequest<GoalCreateDTO>,
  ): Promise<HTTPResponse<GoalResponseDTO>>;

  findOneById(req: HTTPRequest<null>): Promise<HTTPResponse<GoalResponseDTO>>;

  findByFilter(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<GoalResponseDTO[]>>;

  update(
    req: HTTPRequest<GoalUpdateDTO>,
  ): Promise<HTTPResponse<GoalResponseDTO>>;

  addProgressEntry(
    req: HTTPRequest<Pick<GoalProgressEntryDTO, 'date' | 'value'>>,
  ): Promise<HTTPResponse<GoalResponseDTO>>;

  delete(req: HTTPRequest<null>): Promise<HTTPResponse<null>>;
}
