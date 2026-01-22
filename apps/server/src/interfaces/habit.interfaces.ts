import type {
  HabitCreateDTO,
  HabitFilterDTO,
  HTTPRequest,
  HTTPResponse,
  EntityIdDTO,
  HabitResponseDTO,
  HabitUpdateDTO,
  HabitCheckDTO,
} from '@fokus/shared';
import type { HabitDocument } from '../models/habit.model.js';

export interface IHabitRepository {
  create(newData: HabitCreateDTO): Promise<HabitDocument>;

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
    newData: HabitUpdateDTO,
    userId: EntityIdDTO,
  ): Promise<HabitDocument | null>;

  delete(
    habitId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<HabitDocument | null>;
}

export interface IHabitService {
  create(newData: HabitCreateDTO): Promise<HabitResponseDTO>;

  findOneById(
    habitId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<HabitResponseDTO>;

  findByFilter(
    filter: HabitFilterDTO,
    userId: EntityIdDTO,
  ): Promise<HabitResponseDTO[]>;

  update(
    habitId: EntityIdDTO,
    newData: HabitUpdateDTO,
    userId: EntityIdDTO,
  ): Promise<HabitResponseDTO>;

  delete(habitId: EntityIdDTO, userId: EntityIdDTO): Promise<void>;
}

export interface IhabitCompletionService {
  check(checkData: HabitCheckDTO): Promise<HabitResponseDTO>;
}

export interface IHabitController {
  create(
    req: HTTPRequest<Omit<HabitCreateDTO, 'userId'>>,
  ): Promise<HTTPResponse<HabitResponseDTO>>;

  findOneById(req: HTTPRequest<null>): Promise<HTTPResponse<HabitResponseDTO>>;

  findByFilter(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<HabitResponseDTO[]>>;

  update(
    req: HTTPRequest<HabitUpdateDTO>,
  ): Promise<HTTPResponse<HabitResponseDTO>>;

  check(req: HTTPRequest<null>): Promise<HTTPResponse<HabitResponseDTO>>;

  delete(req: HTTPRequest<null>): Promise<HTTPResponse<null>>;
}
