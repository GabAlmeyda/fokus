import type {
  CreateGoalDTO,
  GoalFilterDTO,
  HTTPRequest,
  HTTPResponse,
  MongoIdDTO,
  ResponseGoalDTO,
  UpdateGoalDTO,
} from '@fokus/shared';
import type { GoalDocument } from '../models/goal-model.js';

export interface IGoalRepository {
  create(
    goal: CreateGoalDTO & { currentValue: number | null },
  ): Promise<GoalDocument>;

  findOneById(
    goalId: MongoIdDTO,
    userId: MongoIdDTO,
  ): Promise<GoalDocument | null>;

  findByFilter(
    filter: GoalFilterDTO,
    userId: MongoIdDTO,
  ): Promise<GoalDocument[]>;

  update(
    goalId: MongoIdDTO,
    newData: UpdateGoalDTO,
    userId: MongoIdDTO,
  ): Promise<GoalDocument | null>;
}

export interface IGoalService {
  create(goal: CreateGoalDTO): Promise<GoalDocument>;

  findOneById(goalId: MongoIdDTO, userId: MongoIdDTO): Promise<GoalDocument>;

  findByFilter(
    filter: GoalFilterDTO,
    userId: MongoIdDTO,
  ): Promise<GoalDocument[]>;

  update(
    goalId: MongoIdDTO,
    newData: UpdateGoalDTO,
    userId: MongoIdDTO,
  ): Promise<GoalDocument>;
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
}
