import type {
  GoalCreateDTO,
  GoalFilterDTO,
  HTTPRequest,
  HTTPResponse,
  EntityIdDTO,
  GoalResponseDTO,
  GoalUpdateDTO,
} from '@fokus/shared';
import type { GoalDocument } from '../models/goal.model.js';

export interface IGoalRepository {
  create(
    goal: GoalCreateDTO & { currentValue: number | null },
  ): Promise<GoalDocument>;

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
  create(goal: GoalCreateDTO): Promise<GoalDocument>;

  findOneById(goalId: EntityIdDTO, userId: EntityIdDTO): Promise<GoalDocument>;

  findByFilter(
    filter: GoalFilterDTO,
    userId: EntityIdDTO,
  ): Promise<GoalDocument[]>;

  update(
    goalId: EntityIdDTO,
    newData: GoalUpdateDTO,
    userId: EntityIdDTO,
  ): Promise<GoalDocument>;

  delete(goalId: EntityIdDTO, userId: EntityIdDTO): Promise<GoalDocument>;
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

  delete(req: HTTPRequest<null>): Promise<HTTPResponse<GoalResponseDTO>>;
}
