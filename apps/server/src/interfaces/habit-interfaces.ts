import type {
  CreateHabitDTO,
  HabitFilterDTO,
  HTTPRequest,
  HTTPResponse,
  MongoIdDTO,
  ResponseHabitDTO,
  UpdateHabitDTO,
} from '@fokus/shared';
import type { HabitDocument } from '../models/habit-model.js';

export interface IHabitRepository {
  create(habit: CreateHabitDTO): Promise<HabitDocument>;

  findOneById(
    habitId: MongoIdDTO,
    userId: MongoIdDTO,
  ): Promise<HabitDocument | null>;

  findByFilter(
    filter: HabitFilterDTO,
    userId: MongoIdDTO,
  ): Promise<HabitDocument[]>;

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

  findOneById(habitId: MongoIdDTO, userId: MongoIdDTO): Promise<HabitDocument>;

  findByFilter(
    filter: HabitFilterDTO,
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

  findOneById(req: HTTPRequest<null>): Promise<HTTPResponse<ResponseHabitDTO>>;

  findByFilter(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<ResponseHabitDTO[]>>;

  update(
    req: HTTPRequest<UpdateHabitDTO>,
  ): Promise<HTTPResponse<ResponseHabitDTO>>;

  delete(req: HTTPRequest<null>): Promise<HTTPResponse<null>>;
}
