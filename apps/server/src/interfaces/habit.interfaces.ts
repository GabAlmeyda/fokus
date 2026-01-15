import type {
  HabitCreateDTO,
  HabitFilterDTO,
  HTTPRequest,
  HTTPResponse,
  EntityIdDTO,
  HabitResponseDTO,
  HabitUpdateDTO,
} from '@fokus/shared';
import type { HabitDocument } from '../models/habit.model.js';

export interface IHabitRepository {
  create(habit: HabitCreateDTO): Promise<HabitDocument>;

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
  create(habit: HabitCreateDTO): Promise<HabitDocument>;

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
    newData: HabitUpdateDTO,
    userId: EntityIdDTO,
  ): Promise<HabitDocument>;

  delete(habitId: EntityIdDTO, userId: EntityIdDTO): Promise<void>;
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

  delete(req: HTTPRequest<null>): Promise<HTTPResponse<null>>;
}
