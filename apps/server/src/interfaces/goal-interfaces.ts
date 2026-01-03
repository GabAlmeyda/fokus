import type {
  CreateGoalDTO,
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
}

export interface IGoalService {
  create(goal: CreateGoalDTO): Promise<GoalDocument>;

  findAll(userId: MongoIdDTO): Promise<GoalDocument[]>;

  findOneById(goalId: MongoIdDTO, userId: MongoIdDTO): Promise<GoalDocument>;
}

export interface IGoalController {
  create(
    req: HTTPRequest<CreateGoalDTO>,
  ): Promise<HTTPResponse<ResponseGoalDTO>>;

  findAll(req: HTTPRequest<null>): Promise<HTTPResponse<ResponseGoalDTO[]>>;

  findOneById(req: HTTPRequest<null>): Promise<HTTPResponse<ResponseGoalDTO>>;
}
