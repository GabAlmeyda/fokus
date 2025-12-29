import type {
  CreateHabitDTO,
  HTTPRequest,
  HTTPResponse,
  MongoIdDTO,
  ResponseHabitDTO,
  WeekDayDTO,
} from '@fokus/shared';
import type { HabitDocument } from '../models/habit-model.js';

export interface IHabitRepository {
  create(habit: CreateHabitDTO): Promise<HabitDocument>;

  findOneById(habitId: string, userId: string): Promise<HabitDocument | null>;

  findAllByUser(userId: string): Promise<HabitDocument[]>;

  findAllByWeekDay(day: WeekDayDTO, userId: string): Promise<HabitDocument[]>;
}

export interface IHabitService {
  create(habit: CreateHabitDTO): Promise<HabitDocument>;

  findOneById(habitId: MongoIdDTO, userId: MongoIdDTO): Promise<HabitDocument>;

  findAllByUser(userId: MongoIdDTO): Promise<HabitDocument[]>;

  findAllByWeekDay(
    day: WeekDayDTO,
    userId: MongoIdDTO,
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

  findAllByWeekDay(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<ResponseHabitDTO[]>>;
}
