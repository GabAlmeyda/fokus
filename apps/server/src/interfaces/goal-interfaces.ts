import type {
  CreateGoalDTO,
  HTTPRequest,
  HTTPResponse,
  ResponseGoalDTO,
} from '@fokus/shared';
import type { GoalDocument } from '../models/goal-model.js';

export interface IGoalRepository {
  create(
    goal: CreateGoalDTO & { currentValue: number | null },
  ): Promise<GoalDocument>;
}

export interface IGoalService {
  create(goal: CreateGoalDTO): Promise<GoalDocument>;
}

export interface IGoalController {
  create(
    req: HTTPRequest<CreateGoalDTO>,
  ): Promise<HTTPResponse<ResponseGoalDTO>>;
}
