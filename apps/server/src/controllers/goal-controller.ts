import {
  type HTTPRequest,
  type CreateGoalDTO,
  type HTTPResponse,
  type ResponseGoalDTO,
  CreateGoalSchema,
  HTTPStatusCode,
  MongoIdSchema,
} from '@fokus/shared';
import type { IGoalController } from '../interfaces/goal-interfaces.js';
import { formatHTTPErrorResponse } from '../helpers/controller-helpers.js';
import { GoalService } from '../services/goal-services.js';
import { mapGoalDocToPublicDTO } from '../helpers/mappers.js';

export class GoalController implements IGoalController {
  private readonly goalService = new GoalService();

  async create(
    req: HTTPRequest<CreateGoalDTO>,
  ): Promise<HTTPResponse<ResponseGoalDTO>> {
    try {
      const goal = CreateGoalSchema.parse({
        ...req.body,
        userId: req.userId,
      });

      const createdGoalDoc = await this.goalService.create(goal);
      const createdGoal = mapGoalDocToPublicDTO(createdGoalDoc);

      return { statusCode: HTTPStatusCode.CREATED, body: createdGoal };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }

  async findAll(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<ResponseGoalDTO[]>> {
    try {
      const userId = MongoIdSchema.parse(req.userId);

      const goalDocs = await this.goalService.findAll(userId);
      const goals = goalDocs.map((g) => mapGoalDocToPublicDTO(g));

      return { statusCode: HTTPStatusCode.CREATED, body: goals };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }

  async findOneById(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<ResponseGoalDTO>> {
    try {
      const goalId = MongoIdSchema.parse(req.params?.goalId);
      const userId = MongoIdSchema.parse(req.userId);

      const goalDoc = await this.goalService.findOneById(goalId, userId);
      const goal = mapGoalDocToPublicDTO(goalDoc);

      return { statusCode: HTTPStatusCode.OK, body: goal };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }
}
