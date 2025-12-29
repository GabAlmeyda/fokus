import {
  type CreateHabitDTO,
  type MongoIdDTO,
  type WeekDayDTO,
} from '@fokus/shared';
import type { IHabitService } from '../interfaces/habit-interfaces.js';
import type { HabitDocument } from '../models/habit-model.js';
import { AppServerError } from '../helpers/app-server-error.js';
import { HabitRepository } from '../repositories/habit-repository.js';

export class HabitService implements IHabitService {
  private readonly habitRepository = new HabitRepository();

  async create(habit: CreateHabitDTO): Promise<HabitDocument> {
    const createdHabitDoc = await this.habitRepository.create(habit);

    return createdHabitDoc;
  }

  async findOneByTitleAndUser(
    title: string,
    userId: MongoIdDTO,
  ): Promise<HabitDocument> {
    const habitDoc = await this.habitRepository.findOneByTitleAndUser(
      title,
      userId,
    );
    if (!habitDoc) {
      throw new AppServerError(
        'NOT_FOUND',
        `Habit with title '${title}' not found.`,
      );
    }

    return habitDoc;
  }

  async findOneByIdAndUser(
    habitId: MongoIdDTO,
    userId: MongoIdDTO,
  ): Promise<HabitDocument> {
    const habitDoc = await this.habitRepository.findOneByIdAndUser(
      habitId,
      userId,
    );
    if (!habitDoc) {
      throw new AppServerError(
        'NOT_FOUND',
        `Habit with ID '${habitId}' not found.`,
      );
    }

    return habitDoc;
  }

  async findAllByUser(userId: MongoIdDTO): Promise<HabitDocument[]> {
    const habitDocs = await this.habitRepository.findAllByUser(userId);

    return habitDocs;
  }

  async findAllByWeekDayAndUser(
    day: WeekDayDTO,
    userId: MongoIdDTO,
  ): Promise<HabitDocument[]> {
    const habitDocs = await this.habitRepository.findAllByWeekDayAndUser(
      day,
      userId,
    );

    return habitDocs;
  }
}
