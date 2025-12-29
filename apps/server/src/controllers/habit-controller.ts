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
import { AppServerError } from '../helpers/app-server-error.js';

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

  async findOneByTitleAndUser(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<ResponseHabitDTO>> {
    try {
      const title = req.params?.title;
      if (typeof title !== 'string') {
        throw new AppServerError('BAD_REQUEST', 'Invalid title provided.');
      }

      const userId = MongoIdSchema.parse(req.userId);

      const habitDoc = await this.habitService.findOneByTitleAndUser(
        title,
        userId,
      );
      const habit = mapHabitDocToPublicDTO(habitDoc);

      return { statusCode: HTTPStatusCode.OK, body: habit };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }

  async findOneByIdAndUser(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<ResponseHabitDTO>> {
    try {
      const habitId = MongoIdSchema.parse(req.params?.habitId);
      const userId = MongoIdSchema.parse(req.userId);

      const habitDoc = await this.habitService.findOneByIdAndUser(
        habitId,
        userId,
      );
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

  async findAllByWeekDayAndUser(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<ResponseHabitDTO[]>> {
    try {
      const day = WeekDaySchema.parse(req.query?.day);
      const userId = MongoIdSchema.parse(req.userId);

      const habitDocs = await this.habitService.findAllByWeekDayAndUser(
        day,
        userId,
      );
      const habits = habitDocs.map((h) => mapHabitDocToPublicDTO(h));

      return { statusCode: HTTPStatusCode.OK, body: habits };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }
}
