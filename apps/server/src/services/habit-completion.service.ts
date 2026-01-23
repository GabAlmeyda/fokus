import type {
  HabitCheckDTO,
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

  async check({
    habitId,
    userId,
    date,
  }: HabitCheckDTO): Promise<HabitResponseDTO> {
    const habit = await this.habitService.findOneById(habitId, userId);
    const log: ProgressLogCreateDTO = {
      userId,
      habitId,
      goalId: null,
      date,
      value: habit.progressImpactValue,
    };
    const goal = (
      await this.goalService.findByFilter({ habitId: habit.id }, userId)
    )[0];
    if (goal) {
      log.goalId = goal.id;
    }
    await this.progressLogService.create(log);
    return habit;
  }
}
