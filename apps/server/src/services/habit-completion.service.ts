import type {
  EntityIdDTO,
  HabitCompletionLogDTO,
  HabitResponseDTO,
  ProgressLogCreateDTO,
} from '@fokus/shared';
import type {
  IhabitCompletionService,
  IHabitService,
} from '../interfaces/habit.interfaces.js';
import type { IGoalService } from '../interfaces/goal.interfaces.js';
import type { IProgressLogService } from '../interfaces/progress-log.interfaces.js';

export class HabitCompletionService implements IhabitCompletionService {
  private readonly habitService;
  private readonly goalService;
  private readonly progressLogService;
  constructor(
    habitService: IHabitService,
    goalService: IGoalService,
    progressLogService: IProgressLogService,
  ) {
    this.habitService = habitService;
    this.goalService = goalService;
    this.progressLogService = progressLogService;
  }

  async check(
    checkData: HabitCompletionLogDTO,
    userId: EntityIdDTO,
  ): Promise<HabitResponseDTO> {
    const habit = await this.habitService.findOneById(
      checkData.habitId,
      userId,
    );
    const log: ProgressLogCreateDTO = {
      userId,
      habitId: habit.id,
      goalId: null,
      date: checkData.date,
      value: habit.progressImpactValue,
    };
    const goal = (
      await this.goalService.findByFilter({ habitId: habit.id }, userId)
    )[0];
    if (goal) {
      log.goalId = goal.id;
    }
    await this.progressLogService.create(log);

    const updatedHabit = await this.habitService.findOneById(habit.id, userId);
    return updatedHabit;
  }

  async uncheck(
    uncheckData: HabitCompletionLogDTO,
    userId: EntityIdDTO,
  ): Promise<HabitResponseDTO> {
    await this.progressLogService.deleteByFilter(
      {
        entityType: 'habitId',
        entityId: uncheckData.habitId,
        date: uncheckData.date,
      },
      userId,
    );

    const habit = await this.habitService.findOneById(
      uncheckData.habitId,
      userId,
    );
    return habit;
  }
}
