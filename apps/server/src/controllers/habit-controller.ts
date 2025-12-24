import {
  type HTTPRequest,
  type CreateHabitDTO,
  type HTTPResponse,
  type ResponseHabitDTO,
  HTTPStatusCode,
} from 'packages/shared/dist/index.js';
import type { IHabitController } from '../interfaces/habit-interfaces.js';
import { HabitService } from '../services/habit-service.js';
import { mapHabitDocToPublicDTO } from '../helpers/mappers.js';
import { formatHTTPErrorResponse } from '../helpers/controller-helpers.js';

export class HabitController implements IHabitController {
  private readonly habitService = new HabitService();

  async create(
    req: HTTPRequest<CreateHabitDTO>,
  ): Promise<HTTPResponse<ResponseHabitDTO>> {
    try {
      const habit = req.body;

      const createdHabitDoc = await this.habitService.create(habit);
      const createdHabit = mapHabitDocToPublicDTO(createdHabitDoc);

      return { statusCode: HTTPStatusCode.CREATED, body: createdHabit };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }
}
