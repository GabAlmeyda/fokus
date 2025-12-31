import type {
  CreateHabitDTO,
  HTTPRequest,
  HTTPResponse,
  MongoIdDTO,
  ResponseHabitDTO,
  UpdateHabitDTO,
  WeekDayDTO,
} from '@fokus/shared';
import type { HabitDocument } from '../models/habit-model.js';

export interface IHabitRepository {
  create(habit: CreateHabitDTO): Promise<HabitDocument>;

  findOneByTitle(
    title: string,
    userId: MongoIdDTO,
  ): Promise<HabitDocument | null>;

  findOneById(habitId: string, userId: string): Promise<HabitDocument | null>;

  findAll(userId: string): Promise<HabitDocument[]>;

  findAllByWeekDay(day: WeekDayDTO, userId: string): Promise<HabitDocument[]>;

  update(
    habitId: MongoIdDTO,
    newData: UpdateHabitDTO,
    userId: MongoIdDTO,
  ): Promise<HabitDocument | null>;

  delete(
    habitId: MongoIdDTO,
    userId: MongoIdDTO,
  ): Promise<HabitDocument | null>;
}

export interface IHabitService {
  create(habit: CreateHabitDTO): Promise<HabitDocument>;

  findOneByTitle(title: string, userId: MongoIdDTO): Promise<HabitDocument>;

  findOneById(habitId: MongoIdDTO, userId: MongoIdDTO): Promise<HabitDocument>;

  findAll(userId: MongoIdDTO): Promise<HabitDocument[]>;

  findAllByWeekDay(
    day: WeekDayDTO,
    userId: MongoIdDTO,
  ): Promise<HabitDocument[]>;

  update(
    habitId: MongoIdDTO,
    newData: UpdateHabitDTO,
    userId: MongoIdDTO,
  ): Promise<HabitDocument>;

  delete(habitId: MongoIdDTO, userId: MongoIdDTO): Promise<void>;
}

export interface IHabitController {
  create(
    req: HTTPRequest<Omit<CreateHabitDTO, 'userId'>>,
  ): Promise<HTTPResponse<ResponseHabitDTO>>;

  findOneByTitle(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<ResponseHabitDTO>>;

  findOneById(req: HTTPRequest<null>): Promise<HTTPResponse<ResponseHabitDTO>>;

  findAll(req: HTTPRequest<null>): Promise<HTTPResponse<ResponseHabitDTO[]>>;

  findAllByWeekDay(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<ResponseHabitDTO[]>>;

  update(
    req: HTTPRequest<UpdateHabitDTO>,
  ): Promise<HTTPResponse<ResponseHabitDTO>>;

  delete(req: HTTPRequest<null>): Promise<HTTPResponse<null>>;
}
