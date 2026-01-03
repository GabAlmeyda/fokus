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
}

export interface IGoalService {
  create(goal: CreateGoalDTO): Promise<GoalDocument>;

  findAll(userId: MongoIdDTO): Promise<GoalDocument[]>;
}

export interface IGoalController {
  create(
    req: HTTPRequest<CreateGoalDTO>,
  ): Promise<HTTPResponse<ResponseGoalDTO>>;

  findAll(req: HTTPRequest<null>): Promise<HTTPResponse<ResponseGoalDTO[]>>;
}
