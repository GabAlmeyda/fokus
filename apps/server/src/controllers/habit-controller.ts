import {
  type HTTPRequest,
  type CreateHabitDTO,
  type HTTPResponse,
  type ResponseHabitDTO,
  HTTPStatusCode,
  CreateHabitSchema,
  MongoIdSchema,
  WeekDaySchema,
} from 'packages/shared/dist/index.js';
import type { IHabitController } from '../interfaces/habit-interfaces.js';
import { HabitService } from '../services/habit-service.js';
import { mapHabitDocToPublicDTO } from '../helpers/mappers.js';
import { formatHTTPErrorResponse } from '../helpers/controller-helpers.js';

export class HabitController implements IHabitController {
  private readonly habitService = new HabitService();

  async create(
    req: HTTPRequest<Omit<CreateHabitDTO, 'userId'>>,
  ): Promise<HTTPResponse<ResponseHabitDTO>> {
    try {
      const habit = CreateHabitSchema.parse({
        ...req.body,
        userId: req.userId,
      });

      const createdHabitDoc = await this.habitService.create(habit);
      const createdHabit = mapHabitDocToPublicDTO(createdHabitDoc);

      return { statusCode: HTTPStatusCode.CREATED, body: createdHabit };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }

  async findOneById(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<ResponseHabitDTO>> {
    try {
      const habitId = MongoIdSchema.parse(req.params?.habitId);
      const userId = MongoIdSchema.parse(req.userId);

      const habitDoc = await this.habitService.findOneById(habitId, userId);
      const habit = mapHabitDocToPublicDTO(habitDoc);

      return { statusCode: HTTPStatusCode.OK, body: habit };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }

  async findAllByUser(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<ResponseHabitDTO[]>> {
    try {
      const userId = MongoIdSchema.parse(req.userId);

      const habitDocs = await this.habitService.findAllByUser(userId);
      const habits = habitDocs.map((h) => mapHabitDocToPublicDTO(h));

      return { statusCode: HTTPStatusCode.OK, body: habits };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }

  async findAllByWeekDay(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<ResponseHabitDTO[]>> {
    try {
      const day = WeekDaySchema.parse(req.query?.day);
      const userId = MongoIdSchema.parse(req.userId);

      const habitDocs = await this.habitService.findAllByWeekDay(day, userId);
      const habits = habitDocs.map((h) => mapHabitDocToPublicDTO(h));

      return { statusCode: HTTPStatusCode.OK, body: habits };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }
}
