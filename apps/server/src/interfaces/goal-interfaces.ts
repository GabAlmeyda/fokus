import type {
  CreateGoalDTO,
  GoalFilterDTO,
  HTTPRequest,
  HTTPResponse,
  EntityIdDTO,
  ResponseGoalDTO,
  UpdateGoalDTO,
} from '@fokus/shared';
import type { GoalDocument } from '../models/goal-model.js';

export interface IGoalRepository {
  create(
    goal: CreateGoalDTO & { currentValue: number | null },
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
    newData: UpdateGoalDTO,
    userId: EntityIdDTO,
  ): Promise<GoalDocument | null>;

  delete(
    goalId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<GoalDocument | null>;
}

export interface IGoalService {
  create(goal: CreateGoalDTO): Promise<GoalDocument>;

  findOneById(goalId: EntityIdDTO, userId: EntityIdDTO): Promise<GoalDocument>;

  findByFilter(
    filter: GoalFilterDTO,
    userId: EntityIdDTO,
  ): Promise<GoalDocument[]>;

  update(
    goalId: EntityIdDTO,
    newData: UpdateGoalDTO,
    userId: EntityIdDTO,
  ): Promise<GoalDocument>;

  delete(goalId: EntityIdDTO, userId: EntityIdDTO): Promise<GoalDocument>;
}

export interface IGoalController {
  create(
    req: HTTPRequest<CreateGoalDTO>,
  ): Promise<HTTPResponse<ResponseGoalDTO>>;

  findOneById(req: HTTPRequest<null>): Promise<HTTPResponse<ResponseGoalDTO>>;

  findByFilter(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<ResponseGoalDTO[]>>;

  update(
    req: HTTPRequest<UpdateGoalDTO>,
  ): Promise<HTTPResponse<ResponseGoalDTO>>;

  delete(req: HTTPRequest<null>): Promise<HTTPResponse<ResponseGoalDTO>>;
}
