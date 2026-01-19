import { differenceInDays, startOfDay } from 'date-fns';

import type {
  EntityIdDTO,
  HabitStatsDTO,
  ProgressLogCreateDTO,
  ProgressLogFilterDTO,
  ProgressLogResponseDTO,
} from '@fokus/shared';
import type { IProgressService } from '../interfaces/progress-log.interfaces.js';
import { ProgressLogRepository } from '../repositories/progress-log.repository.js';
import { AppServerError } from '../helpers/errors/app-server.errors.js';
import { mapProgressLogDocToPublicDTO } from '../helpers/mappers.js';

export class ProgressLogService implements IProgressService {
  private readonly progressLogRepository = new ProgressLogRepository();

  async create(newData: ProgressLogCreateDTO): Promise<ProgressLogResponseDTO> {
    const progressLogDoc = await this.progressLogRepository.create(newData);

    const progressLog = mapProgressLogDocToPublicDTO(progressLogDoc);
    return progressLog;
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

  async getHabitStats(
    userId: EntityIdDTO,
    habitId?: EntityIdDTO,
  ): Promise<Record<EntityIdDTO, HabitStatsDTO>> {
    const habitDates = await this.progressLogRepository.getEntityDates(
      userId,
      'habitId',
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

  async delete(progressLogId: EntityIdDTO, userId: EntityIdDTO): Promise<null> {
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

    return null;
  }
}
