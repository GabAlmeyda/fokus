import type {
  CreateHabitDTO,
  HTTPRequest,
  HTTPResponse,
  ResponseHabitDTO,
} from '@fokus/shared';
import type { HabitDocument } from '../models/habit-model.js';

export interface IHabitRepository {
  create(habit: CreateHabitDTO): Promise<HabitDocument>;

  findOneById(habitId: string, userId: string): Promise<HabitDocument | null>;
}

export interface IHabitService {
  create(habit?: CreateHabitDTO): Promise<HabitDocument>;

  findOneById(habitId?: string, userId?: string): Promise<HabitDocument>;
}

export interface IHabitController {
  create(
    req: HTTPRequest<Omit<CreateHabitDTO, 'userId'>>,
  ): Promise<HTTPResponse<ResponseHabitDTO>>;

  findOneById(req: HTTPRequest<null>): Promise<HTTPResponse<ResponseHabitDTO>>;
}
