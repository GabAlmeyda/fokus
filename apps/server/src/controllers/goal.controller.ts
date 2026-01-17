import {
  type HTTPRequest,
  type GoalCreateDTO,
  type HTTPResponse,
  type GoalResponseDTO,
  GoalCreateSchema,
  HTTPStatusCode,
  EntityIdSchema,
  GoalFilterSchema,
  type GoalUpdateDTO,
  GoalUpdateSchema,
} from '@fokus/shared';
import type { IGoalController } from '../interfaces/goal.interfaces.js';
import { formatHTTPErrorResponse } from '../helpers/controller.helpers.js';
import { GoalService } from '../services/goal.services.js';
import { mapGoalDocToPublicDTO } from '../helpers/mappers.js';

export class GoalController implements IGoalController {
  private readonly goalService = new GoalService();

  async create(
    req: HTTPRequest<GoalCreateDTO>,
  ): Promise<HTTPResponse<GoalResponseDTO>> {
    try {
      const goal = GoalCreateSchema.parse({
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

  async findOneById(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<GoalResponseDTO>> {
    try {
      const goalId = EntityIdSchema.parse(req.params?.goalId);
      const userId = EntityIdSchema.parse(req.userId);

      const goalDoc = await this.goalService.findOneById(goalId, userId);
      const goal = mapGoalDocToPublicDTO(goalDoc);

      return { statusCode: HTTPStatusCode.OK, body: goal };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }

  async findByFilter(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<GoalResponseDTO[]>> {
    try {
      const filter = GoalFilterSchema.parse({
        title: req.query?.title,
        categoryId: req.query?.categoryId,
        deadlineType: req.query?.deadlineType,
      });

      const userId = EntityIdSchema.parse(req.userId);

      const goalDocs = await this.goalService.findByFilter(filter, userId);
      const goals = goalDocs.map((g) => mapGoalDocToPublicDTO(g));

      return { statusCode: HTTPStatusCode.OK, body: goals };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }

  async update(
    req: HTTPRequest<GoalUpdateDTO>,
  ): Promise<HTTPResponse<GoalResponseDTO>> {
    try {
      const goalId = EntityIdSchema.parse(req.params?.goalId);
      const newData = GoalUpdateSchema.parse(req.body);
      const userId = EntityIdSchema.parse(req.userId);

      const updatedGoalDoc = await this.goalService.update(
        goalId,
        newData,
        userId,
      );
      const updatedGoal = mapGoalDocToPublicDTO(updatedGoalDoc);

      return { statusCode: HTTPStatusCode.OK, body: updatedGoal };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }

  async delete(req: HTTPRequest<null>): Promise<HTTPResponse<GoalResponseDTO>> {
    try {
      const goalId = EntityIdSchema.parse(req.params?.goalId);
      const userId = EntityIdSchema.parse(req.userId);

      const deletedGoalDoc = await this.goalService.delete(goalId, userId);
      const deletedGoal = mapGoalDocToPublicDTO(deletedGoalDoc);

      return { statusCode: HTTPStatusCode.OK, body: deletedGoal };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }
}
