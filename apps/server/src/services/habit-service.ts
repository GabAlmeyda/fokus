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
      if (err instanceof MongoRepositoryError || err instanceof ServiceError) {
        throw new ServiceError(err.errorType, err.message, err.invalidFields);
      }

      throw err;
    }
  }

  async findOneById(habitId?: string, userId?: string): Promise<HabitDocument> {
    try {
      if (typeof habitId !== 'string' || habitId.length !== 24) {
        throw new ServiceError('BAD_REQUEST', 'Invalid habit ID provided.');
      }

      if (typeof userId !== 'string' || userId.length !== 24) {
        throw new ServiceError('BAD_REQUEST', 'Invalid user ID provided.');
      }

      const habitDoc = await this.habitRepository.findOneById(habitId, userId);
      if (!habitDoc) {
        throw new ServiceError(
          'NOT_FOUND',
          `Habit with ID '${habitId}' not found.`,
        );
      }

      return habitDoc;
    } catch (err) {
      if (err instanceof MongoRepositoryError || err instanceof ServiceError) {
        throw new ServiceError(err.errorType, err.message, err.invalidFields);
      }

      throw err;
    }
  }

  async findAllByUser(userId?: string): Promise<HabitDocument[]> {
    try {
      if (typeof userId !== 'string' || userId.length !== 24) {
        throw new ServiceError('BAD_REQUEST', 'Invalid user ID provided.');
      }

      const habitDocs = await this.habitRepository.findAllByUser(userId);

      return habitDocs;
    } catch (err) {
      if (err instanceof MongoRepositoryError || err instanceof ServiceError) {
        throw new ServiceError(err.errorType, err.message, err.invalidFields);
      }

      throw err;
    }
  }
}
