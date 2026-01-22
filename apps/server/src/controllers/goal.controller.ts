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
import type {
  IGoalController,
  IGoalService,
} from '../interfaces/goal.interfaces.js';
import { formatHTTPErrorResponse } from '../helpers/controller.helpers.js';

export class GoalController implements IGoalController {
  private readonly goalService;
  constructor(goalService: IGoalService) {
    this.goalService = goalService;
  }

  async create(
    req: HTTPRequest<GoalCreateDTO>,
  ): Promise<HTTPResponse<GoalResponseDTO>> {
    try {
      const newData = GoalCreateSchema.parse({
        ...req.body,
        userId: req.userId,
      });

      const goal = await this.goalService.create(newData);
      return { statusCode: HTTPStatusCode.CREATED, body: goal };
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

      const goal = await this.goalService.findOneById(goalId, userId);
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
        habitId: req.query?.habitId,
        deadlineType: req.query?.deadlineType,
      });

      const userId = EntityIdSchema.parse(req.userId);

      const goals = await this.goalService.findByFilter(filter, userId);
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

      const goalDoc = await this.goalService.update(goalId, newData, userId);
      return { statusCode: HTTPStatusCode.OK, body: goalDoc };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }

  async delete(req: HTTPRequest<null>): Promise<HTTPResponse<null>> {
    try {
      const goalId = EntityIdSchema.parse(req.params?.goalId);
      const userId = EntityIdSchema.parse(req.userId);

      await this.goalService.delete(goalId, userId);
      return { statusCode: HTTPStatusCode.OK, body: null };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }
}
