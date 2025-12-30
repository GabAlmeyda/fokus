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

  findOneByTitleAndUser(
    title: string,
    userId: MongoIdDTO,
  ): Promise<HabitDocument | null>;

  findOneByIdAndUser(
    habitId: string,
    userId: string,
  ): Promise<HabitDocument | null>;

  findAllByUser(userId: string): Promise<HabitDocument[]>;

  findAllByWeekDayAndUser(
    day: WeekDayDTO,
    userId: string,
  ): Promise<HabitDocument[]>;

  update(
    habitId: MongoIdDTO,
    newData: UpdateHabitDTO,
    userId: MongoIdDTO,
  ): Promise<HabitDocument | null>;
}

export interface IHabitService {
  create(habit: CreateHabitDTO): Promise<HabitDocument>;

  findOneByTitleAndUser(
    title: string,
    userId: MongoIdDTO,
  ): Promise<HabitDocument>;

  findOneByIdAndUser(
    habitId: MongoIdDTO,
    userId: MongoIdDTO,
  ): Promise<HabitDocument>;

  findAllByUser(userId: MongoIdDTO): Promise<HabitDocument[]>;

  findAllByWeekDayAndUser(
    day: WeekDayDTO,
    userId: MongoIdDTO,
  ): Promise<HabitDocument[]>;

  update(
    habitId: MongoIdDTO,
    newData: UpdateHabitDTO,
    userId: MongoIdDTO,
  ): Promise<HabitDocument>;
}

export interface IHabitController {
  create(
    req: HTTPRequest<Omit<CreateHabitDTO, 'userId'>>,
  ): Promise<HTTPResponse<ResponseHabitDTO>>;

  findOneByTitleAndUser(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<ResponseHabitDTO>>;

  findOneByIdAndUser(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<ResponseHabitDTO>>;

  findAllByUser(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<ResponseHabitDTO[]>>;

  findAllByWeekDayAndUser(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<ResponseHabitDTO[]>>;

  update(
    req: HTTPRequest<UpdateHabitDTO>,
  ): Promise<HTTPResponse<ResponseHabitDTO>>;
}
