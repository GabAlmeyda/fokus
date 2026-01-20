import {
  HabitUpdateSchema,
  type HabitCreateDTO,
  type HabitFilterDTO,
  type EntityIdDTO,
  type HabitUpdateDTO,
  type HabitStatsDTO,
  type HabitResponseDTO,
} from '@fokus/shared';
import type { IHabitService } from '../interfaces/habit.interfaces.js';
import { AppServerError } from '../helpers/errors/app-server.errors.js';
import { HabitRepository } from '../repositories/habit.repository.js';
import { DatabaseError } from '../helpers/errors/database.errors.js';
import { ProgressLogService } from './progress-log.services.js';
import { mapHabitDocToPublicDTO } from '../helpers/mappers.js';

export class HabitService implements IHabitService {
  private readonly habitRepository = new HabitRepository();
  private readonly progressLogService = new ProgressLogService();

  async create(newData: HabitCreateDTO): Promise<HabitResponseDTO> {
    try {
      const doc = await this.habitRepository.create(newData);
      const stats: HabitStatsDTO = {
        streak: 0,
        bestStreak: 0,
        isCompletedToday: false,
      };

      const habit = mapHabitDocToPublicDTO(doc, stats);
      return habit;
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

  async findOneById(
    habitId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<HabitResponseDTO> {
    const doc = await this.habitRepository.findOneById(habitId, userId);
    if (!doc) {
      throw new AppServerError(
        'NOT_FOUND',
        `Habit with ID '${habitId}' not found.`,
      );
    }
    const stats = (await this.getHabitStats(userId, habitId))[habitId]!;

    const habit = mapHabitDocToPublicDTO(doc, stats);
    return habit;
  }

  async findByFilter(
    filter: HabitFilterDTO,
    userId: EntityIdDTO,
  ): Promise<HabitResponseDTO[]> {
    const docs = await this.habitRepository.findByFilter(filter, userId);
    const stats = await this.getHabitStats(userId);

    const habits = docs.map((d) =>
      mapHabitDocToPublicDTO(d, stats[d._id.toString()]!),
    );
    return habits;
  }

  async update(
    habitId: EntityIdDTO,
    newData: HabitUpdateDTO,
    userId: EntityIdDTO,
  ): Promise<HabitResponseDTO> {
    // Verifies if the habit exists
    const doc = await this.habitRepository.findOneById(habitId, userId);
    if (!doc) {
      throw new AppServerError(
        'NOT_FOUND',
        `Habit with ID '${habitId}' not found.`,
      );
    }

    // Validate the provided data
    const mergedHabit = { ...doc.toObject(), ...newData };
    HabitUpdateSchema.parse(mergedHabit);

    try {
      const updatedDoc = await this.habitRepository.update(
        habitId,
        newData,
        userId,
      );
      if (!updatedDoc) {
        throw new AppServerError(
          'NOT_FOUND',
          `Habit with ID '${habitId}' not found.`,
        );
      }
      const stats = (await this.getHabitStats(userId, habitId))[habitId]!;

      const habit = mapHabitDocToPublicDTO(updatedDoc, stats);
      return habit;
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

  private async getHabitStats(
    userId: EntityIdDTO,
    habitId?: EntityIdDTO,
  ): Promise<Record<EntityIdDTO, HabitStatsDTO>> {
    const registeredStats = await this.progressLogService.getHabitActivityStats(
      userId,
      habitId,
    );

    const habits = habitId
      ? [await this.habitRepository.findOneById(habitId, userId)]
      : await this.habitRepository.findByFilter({}, userId);

    const stats: Record<EntityIdDTO, HabitStatsDTO> = {};
    for (const h of habits) {
      if (!h) continue;

      stats[h._id.toString()] = registeredStats[h._id.toString()] || {
        streak: 0,
        bestStreak: 0,
        isCompletedToday: false,
      };
    }

    return stats;
  }

  async delete(habitId: EntityIdDTO, userId: EntityIdDTO): Promise<void> {
    const doc = await this.habitRepository.delete(habitId, userId);
    if (!doc) {
      throw new AppServerError(
        'NOT_FOUND',
        `Habit with ID '${habitId}' not found.`,
      );
    }
  }
}
