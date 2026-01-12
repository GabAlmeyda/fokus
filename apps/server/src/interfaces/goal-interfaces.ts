import type {
  CreateGoalDTO,
  GoalFilterDTO,
  HTTPRequest,
  HTTPResponse,
  MongoIdDTO,
  ResponseGoalDTO,
} from '@fokus/shared';
import type { GoalDocument } from '../models/goal-model.js';

export interface IGoalRepository {
  create(
    goal: CreateGoalDTO & { currentValue: number | null },
  ): Promise<GoalDocument>;

  findAll(userId: MongoIdDTO): Promise<GoalDocument[]>;

  findOneById(
    goalId: MongoIdDTO,
    userId: MongoIdDTO,
  ): Promise<GoalDocument | null>;

  findByFilter(
    filter: GoalFilterDTO,
    userId: MongoIdDTO,
  ): Promise<GoalDocument[]>;
}

export interface IGoalService {
  create(goal: CreateGoalDTO): Promise<GoalDocument>;

  findAll(userId: MongoIdDTO): Promise<GoalDocument[]>;

  findOneById(goalId: MongoIdDTO, userId: MongoIdDTO): Promise<GoalDocument>;

  findByFilter(
    filter: GoalFilterDTO,
    userId: MongoIdDTO,
  ): Promise<GoalDocument[]>;
}

export interface IGoalController {
  create(
    req: HTTPRequest<CreateGoalDTO>,
  ): Promise<HTTPResponse<ResponseGoalDTO>>;

  findAll(req: HTTPRequest<null>): Promise<HTTPResponse<ResponseGoalDTO[]>>;

  findOneById(req: HTTPRequest<null>): Promise<HTTPResponse<ResponseGoalDTO>>;

  findByFilter(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<ResponseGoalDTO[]>>;
}
