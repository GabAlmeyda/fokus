import {
  HabitUpdateSchema,
  type HabitCreateDTO,
  type HabitFilterDTO,
  type EntityIdDTO,
  type HabitUpdateDTO,
} from '@fokus/shared';
import type { IHabitService } from '../interfaces/habit.interfaces.js';
import type { HabitDocument } from '../models/habit.model.js';
import { AppServerError } from '../helpers/errors/app-server.errors.js';
import { HabitRepository } from '../repositories/habit.repository.js';
import { DatabaseError } from '../helpers/errors/database.errors.js';

export class HabitService implements IHabitService {
  private readonly habitRepository = new HabitRepository();

  async create(habit: HabitCreateDTO): Promise<HabitDocument> {
    try {
      const createdHabitDoc = await this.habitRepository.create(habit);
      return createdHabitDoc;
    } catch (err) {
      if (err instanceof DatabaseError && err.isConflict) {
        throw new AppServerError(
          'CONFLICT',
          `Habit with title '${habit.title}' already exists.`,
          [{ field: 'title', message: 'Value is already registered.' }],
        );
      }

      throw err;
    }
  }

  async findOneById(
    habitId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<HabitDocument> {
    const habitDoc = await this.habitRepository.findOneById(habitId, userId);
    if (!habitDoc) {
      throw new AppServerError(
        'NOT_FOUND',
        `Habit with ID '${habitId}' not found.`,
      );
    }

    return habitDoc;
  }

  async findByFilter(
    filter: HabitFilterDTO,
    userId: EntityIdDTO,
  ): Promise<HabitDocument[]> {
    const habitDocs = await this.habitRepository.findByFilter(filter, userId);

    return habitDocs;
  }

  async update(
    habitId: EntityIdDTO,
    newData: HabitUpdateDTO,
    userId: EntityIdDTO,
  ): Promise<HabitDocument> {
    // Verifies if the habit exists
    const currentHabitDoc = await this.habitRepository.findOneById(
      habitId,
      userId,
    );
    if (!currentHabitDoc) {
      throw new AppServerError(
        'NOT_FOUND',
        `Habit with ID '${habitId}' not found.`,
      );
    }

    // Validate the provided data
    const mergedHabit = { ...currentHabitDoc.toObject(), ...newData };
    HabitUpdateSchema.parse(mergedHabit);

    try {
      const updatedHabitDoc = await this.habitRepository.update(
        habitId,
        newData,
        userId,
      );
      if (!updatedHabitDoc) {
        throw new AppServerError(
          'NOT_FOUND',
          `Habit with ID '${habitId}' not found.`,
        );
      }

      return updatedHabitDoc;
    } catch (err) {
      if (err instanceof DatabaseError && err.isConflict) {
        throw new AppServerError(
          'CONFLICT',
          `Habit with title '${newData.title}' already exists.`,
          [{ field: 'title', message: 'Value is already registered.' }],
        );
      }

      throw err;
    }
  }

  async delete(habitId: EntityIdDTO, userId: EntityIdDTO): Promise<void> {
    const deletedHabitDoc = await this.habitRepository.delete(habitId, userId);
    if (!deletedHabitDoc) {
      throw new AppServerError(
        'NOT_FOUND',
        `Habit with ID '${habitId}' not found.`,
      );
    }
  }
}
