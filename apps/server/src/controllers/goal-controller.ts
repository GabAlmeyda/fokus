import {
  type HTTPRequest,
  type CreateGoalDTO,
  type HTTPResponse,
  type ResponseGoalDTO,
  CreateGoalSchema,
  HTTPStatusCode,
} from 'packages/shared/dist/index.js';
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
}
