import { differenceInDays, startOfDay } from 'date-fns';

import type {
  EntityIdDTO,
  HabitStatsDTO,
  ProgressLogCreateDTO,
  ProgressLogFilterDTO,
  ProgressLogResponseDTO,
} from '@fokus/shared';
import type {
  IProgressLogRepository,
  IProgressLogService,
} from '../interfaces/progress-log.interfaces.js';
import { AppServerError } from '../helpers/errors/app-server.errors.js';
import { mapProgressLogDocToPublicDTO } from '../helpers/mappers.helpers.js';
import { DatabaseError } from '../helpers/errors/database.errors.js';
import type { ProgressLogDeleteDTO } from '../types/progress-log.types.js';

export class ProgressLogService implements IProgressLogService {
  private readonly progressLogRepository;
  constructor(progressLogRepository: IProgressLogRepository) {
    this.progressLogRepository = progressLogRepository;
  }

  async create(newData: ProgressLogCreateDTO): Promise<ProgressLogResponseDTO> {
    try {
      const progressLogDoc = await this.progressLogRepository.create(newData);

      const progressLog = mapProgressLogDocToPublicDTO(progressLogDoc);
      return progressLog;
    } catch (err) {
      if (err instanceof DatabaseError && err.isConflict) {
        throw new AppServerError(
          'CONFLICT',
          'Cannot have two progress logs for habit with the same date.',
          [
            {
              field: 'date',
              message:
                'The provided date is already registered for this habit.',
            },
          ],
        );
      }

      throw err;
    }
  }

  async findOneById(
    progressLogId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<ProgressLogResponseDTO> {
    const progressLogDoc = await this.progressLogRepository.findOneById(
      progressLogId,
      userId,
    );
    if (!progressLogDoc) {
      throw new AppServerError(
        'NOT_FOUND',
        `ProgressLog with ID '${progressLogId}' not found.`,
      );
    }

    const progressLog = mapProgressLogDocToPublicDTO(progressLogDoc);
    return progressLog;
  }

  async findByFilter(
    filter: ProgressLogFilterDTO,
    userId: EntityIdDTO,
  ): Promise<ProgressLogResponseDTO[]> {
    const progressLogDocs = await this.progressLogRepository.findByFilter(
      filter,
      userId,
    );

    const progressLogs = progressLogDocs.map((p) =>
      mapProgressLogDocToPublicDTO(p),
    );
    return progressLogs;
  }

  async getHabitActivityStats(
    userId: EntityIdDTO,
    habitId?: EntityIdDTO,
  ): Promise<Record<EntityIdDTO, HabitStatsDTO>> {
    const habitDates = await this.progressLogRepository.getEntityDates(
      'habitId',
      userId,
      habitId,
    );

    const stats: Record<EntityIdDTO, HabitStatsDTO> = {};

    for (const data of habitDates) {
      const dates = data.dates;

      if (dates.length === 0) continue;

      // Logic for 'isCompletedToday'
      const today = startOfDay(new Date());
      const lastLogDate = dates[0]!;
      const isCompletedToday = differenceInDays(today, lastLogDate) === 0;

      // Logic for 'streak'
      let streak = 0;
      if (differenceInDays(today, lastLogDate) <= 1) {
        streak = 1;

        for (let i = 0; i < dates.length - 1; i++) {
          const currDate = dates[i]!;
          const lastDate = dates[i + 1]!;

          if (differenceInDays(currDate, lastDate) === 1) {
            streak++;
          } else {
            break;
          }
        }
      }

      // logic for 'bestStreak'
      let bestStreak = 1;
      let tempStreak = 1;
      for (let i = 0; i < dates.length - 1; i++) {
        const currDate = dates[i]!;
        const lastDate = dates[i + 1]!;

        if (differenceInDays(currDate, lastDate) === 1) {
          tempStreak++;
          bestStreak = Math.max(bestStreak, tempStreak);
        } else {
          tempStreak = 1;
        }
      }

      stats[data.entityId] = { streak, bestStreak, isCompletedToday };
    }

    return stats;
  }

  async getGoalActivityStats(
    userId: EntityIdDTO,
    goalId?: EntityIdDTO,
  ): Promise<Record<EntityIdDTO, number>> {
    const currentValues = await this.progressLogRepository.getGoalCurrentValues(
      userId,
      goalId,
    );

    const stats: Record<EntityIdDTO, number> = {};
    for (const c of currentValues) {
      stats[c.goalId] = c.currentValue;
    }

    return stats;
  }

  async delete(progressLogId: EntityIdDTO, userId: EntityIdDTO): Promise<void> {
    const progressLogDoc = await this.progressLogRepository.delete(
      progressLogId,
      userId,
    );
    if (!progressLogDoc) {
      throw new AppServerError(
        'NOT_FOUND',
        `Progress log with ID '${progressLogId}' not found.`,
      );
    }
  }

  async deleteByFilter(
    filter: ProgressLogDeleteDTO,
    userId: EntityIdDTO,
  ): Promise<void> {
    const date = new Date(filter.date);
    date.setUTCHours(0, 0, 0, 0);

    const progressLogDoc = await this.progressLogRepository.deleteByFilter(
      {
        ...filter,
        date,
      },
      userId,
    );
    if (!progressLogDoc) {
      throw new AppServerError(
        'NOT_FOUND',
        `Log of '${filter.entityType.replace('Id', '')}' with ID '${filter.entityId}' and date '${filter.date}' not found.`,
      );
    }
  }
}
