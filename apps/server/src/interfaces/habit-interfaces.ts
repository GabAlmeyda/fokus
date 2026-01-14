import type {
  CreateHabitDTO,
  HabitFilterDTO,
  HTTPRequest,
  HTTPResponse,
  EntityIdDTO,
  ResponseHabitDTO,
  UpdateHabitDTO,
} from '@fokus/shared';
import type { HabitDocument } from '../models/habit-model.js';

export interface IHabitRepository {
  create(habit: CreateHabitDTO): Promise<HabitDocument>;

  findOneById(
    habitId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<HabitDocument | null>;

  findByFilter(
    filter: HabitFilterDTO,
    userId: EntityIdDTO,
  ): Promise<HabitDocument[]>;

  update(
    habitId: EntityIdDTO,
    newData: UpdateHabitDTO,
    userId: EntityIdDTO,
  ): Promise<HabitDocument | null>;

  delete(
    habitId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<HabitDocument | null>;
}

export interface IHabitService {
  create(habit: CreateHabitDTO): Promise<HabitDocument>;

  findOneById(
    habitId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<HabitDocument>;

  findByFilter(
    filter: HabitFilterDTO,
    userId: EntityIdDTO,
  ): Promise<HabitDocument[]>;

  update(
    habitId: EntityIdDTO,
    newData: UpdateHabitDTO,
    userId: EntityIdDTO,
  ): Promise<HabitDocument>;

  delete(habitId: EntityIdDTO, userId: EntityIdDTO): Promise<void>;
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
