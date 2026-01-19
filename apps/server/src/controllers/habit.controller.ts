import {
  type HTTPRequest,
  type HabitCreateDTO,
  type HTTPResponse,
  type HabitResponseDTO,
  HTTPStatusCode,
  HabitCreateSchema,
  EntityIdSchema,
  HabitUpdateSchema,
  type HabitUpdateDTO,
  HabitFilterSchema,
} from '@fokus/shared';
import type { IHabitController } from '../interfaces/habit.interfaces.js';
import { HabitService } from '../services/habit.service.js';
import { formatHTTPErrorResponse } from '../helpers/controller.helpers.js';

export class HabitController implements IHabitController {
  private readonly habitService = new HabitService();

  async create(
    req: HTTPRequest<Omit<HabitCreateDTO, 'userId'>>,
  ): Promise<HTTPResponse<HabitResponseDTO>> {
    try {
      const newData = HabitCreateSchema.parse({
        ...req.body,
        userId: req.userId,
      });

      const habit = await this.habitService.create(newData);
      return { statusCode: HTTPStatusCode.CREATED, body: habit };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }

  async findOneById(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<HabitResponseDTO>> {
    try {
      const habitId = EntityIdSchema.parse(req.params?.habitId);
      const userId = EntityIdSchema.parse(req.userId);

      const habit = await this.habitService.findOneById(habitId, userId);
      return { statusCode: HTTPStatusCode.OK, body: habit };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }

  async findByFilter(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<HabitResponseDTO[]>> {
    try {
      const filter = HabitFilterSchema.parse({
        title: req.query?.title,
        weekDay: req.query?.weekDay,
      });
      const userId = EntityIdSchema.parse(req.userId);

      const habits = await this.habitService.findByFilter(filter, userId);
      return { statusCode: HTTPStatusCode.OK, body: habits };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }

  async update(
    req: HTTPRequest<HabitUpdateDTO>,
  ): Promise<HTTPResponse<HabitResponseDTO>> {
    try {
      const habitId = EntityIdSchema.parse(req.params?.habitId);
      const newData = HabitUpdateSchema.parse(req.body);
      const userId = EntityIdSchema.parse(req.userId);

      const habit = await this.habitService.update(habitId, newData, userId);
      return { statusCode: HTTPStatusCode.OK, body: habit };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }

  async delete(req: HTTPRequest<null>): Promise<HTTPResponse<null>> {
    try {
      const habitId = EntityIdSchema.parse(req.params?.habitId);
      const userId = EntityIdSchema.parse(req.userId);

      await this.habitService.delete(habitId, userId);
      return { statusCode: HTTPStatusCode.NO_CONTENT, body: null };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }
}
