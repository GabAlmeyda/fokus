import {
  CreateHabitSchema,
  formatZodError,
  type CreateHabitDTO,
} from '@fokus/shared';
import type { IHabitService } from '../interfaces/habit-interfaces.js';
import type { HabitDocument } from '../models/habit-model.js';
import { ServiceError } from '../helpers/service-errors.js';
import { HabitRepository } from '../repositories/habit-repository.js';
import { MongoRepositoryError } from '../helpers/mongo-errors.js';

export class HabitService implements IHabitService {
  private readonly habitRepository = new HabitRepository();

  async create(habit?: CreateHabitDTO): Promise<HabitDocument> {
    try {
      const validation = CreateHabitSchema.safeParse(habit);
      if (!validation.success) {
        const { errorType, message, invalidFields } = formatZodError(
          validation.error,
        );

        throw new ServiceError(errorType, message, invalidFields);
      }

      const createdHabitDoc = await this.habitRepository.create(
        validation.data,
      );

      return createdHabitDoc;
    } catch (err) {
      if (err instanceof MongoRepositoryError) {
        throw new ServiceError(err.errorType, err.message, err.invalidFields);
      }

      throw err;
    }
  }
}
