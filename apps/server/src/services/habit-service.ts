import {
  UpdateHabitSchema,
  type CreateHabitDTO,
  type MongoIdDTO,
  type UpdateHabitDTO,
  type WeekDayDTO,
} from '@fokus/shared';
import type { IHabitService } from '../interfaces/habit-interfaces.js';
import type { HabitDocument } from '../models/habit-model.js';
import { AppServerError } from '../helpers/app-server-error.js';
import { HabitRepository } from '../repositories/habit-repository.js';

export class HabitService implements IHabitService {
  private readonly habitRepository = new HabitRepository();

  async create(habit: CreateHabitDTO): Promise<HabitDocument> {
    const habitDoc = await this.habitRepository.findOneByTitle(
      habit.title,
      habit.userId,
    );
    if (habitDoc) {
      throw new AppServerError(
        'CONFLICT',
        `Habit with title '${habitDoc.title}' already exists.`,
        [{ field: 'title', message: 'Value is already registered.' }],
      );
    }

    const createdHabitDoc = await this.habitRepository.create(habit);

    return createdHabitDoc;
  }

  async findOneByTitle(
    title: string,
    userId: MongoIdDTO,
  ): Promise<HabitDocument> {
    const habitDoc = await this.habitRepository.findOneByTitle(title, userId);
    if (!habitDoc) {
      throw new AppServerError(
        'NOT_FOUND',
        `Habit with title '${title}' not found.`,
      );
    }

    return habitDoc;
  }

  async findOneById(
    habitId: MongoIdDTO,
    userId: MongoIdDTO,
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

  async findAll(userId: MongoIdDTO): Promise<HabitDocument[]> {
    const habitDocs = await this.habitRepository.findAll(userId);

    return habitDocs;
  }

  async findAllByWeekDay(
    day: WeekDayDTO,
    userId: MongoIdDTO,
  ): Promise<HabitDocument[]> {
    const habitDocs = await this.habitRepository.findAllByWeekDay(day, userId);

    return habitDocs;
  }

  async update(
    habitId: MongoIdDTO,
    newData: UpdateHabitDTO,
    userId: MongoIdDTO,
  ): Promise<HabitDocument> {
    // Verifies if the name is already registered
    if (newData.title) {
      const habitDoc = await this.habitRepository.findOneByTitle(
        newData.title,
        userId,
      );
      if (habitDoc) {
        throw new AppServerError(
          'CONFLICT',
          `Habit with title '${newData.title}' already exists.`,
        );
      }
    }

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
    const mergedHabitDoc = { ...currentHabitDoc.toObject(), ...newData };
    UpdateHabitSchema.parse(mergedHabitDoc);

    const updatedHabitDoc = await this.habitRepository.update(
      habitId,
      newData,
      userId,
    );

    return updatedHabitDoc!;
  }

  async delete(habitId: MongoIdDTO, userId: MongoIdDTO): Promise<void> {
    const deletedHabitDoc = await this.habitRepository.delete(habitId, userId);
    if (!deletedHabitDoc) {
      throw new AppServerError(
        'NOT_FOUND',
        `Habit with ID '${habitId}' not found.`,
      );
    }
  }
}
