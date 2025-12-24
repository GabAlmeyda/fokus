import type {
  CreateHabitDTO,
  HTTPRequest,
  HTTPResponse,
  ResponseHabitDTO,
} from '@fokus/shared';
import type { HabitDocument } from '../models/habit-model.js';

export interface IHabitRepository {
  create(habit: CreateHabitDTO): Promise<HabitDocument>;
}

export interface IHabitService {
  create(habit?: CreateHabitDTO): Promise<HabitDocument>;
}

export interface IHabitController {
  create(
    req: HTTPRequest<CreateHabitDTO>,
  ): Promise<HTTPResponse<ResponseHabitDTO>>;
}
