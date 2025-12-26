import type {
  CreateHabitDTO,
  HTTPRequest,
  HTTPResponse,
  ResponseHabitDTO,
  WeekDay,
} from '@fokus/shared';
import type { HabitDocument } from '../models/habit-model.js';

export interface IHabitRepository {
  create(habit: CreateHabitDTO): Promise<HabitDocument>;

  findOneById(habitId: string, userId: string): Promise<HabitDocument | null>;

  findAllByUser(userId: string): Promise<HabitDocument[]>;

  findAllByWeekDay(day: WeekDay, userId: string): Promise<HabitDocument[]>;
}

export interface IHabitService {
  create(habit?: CreateHabitDTO): Promise<HabitDocument>;

  findOneById(habitId?: string, userId?: string): Promise<HabitDocument>;

  findAllByUser(userId?: string): Promise<HabitDocument[]>;

  findAllByWeekDay(
    day?: WeekDay | string,
    userId?: string,
  ): Promise<HabitDocument[]>;
}

export interface IHabitController {
  create(
    req: HTTPRequest<Omit<CreateHabitDTO, 'userId'>>,
  ): Promise<HTTPResponse<ResponseHabitDTO>>;

  findOneById(req: HTTPRequest<null>): Promise<HTTPResponse<ResponseHabitDTO>>;

  findAllByUser(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<ResponseHabitDTO[]>>;

  findAllByWeekDays(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<ResponseHabitDTO[]>>;
}
