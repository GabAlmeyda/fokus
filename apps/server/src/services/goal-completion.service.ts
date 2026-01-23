import type {
  GoalProgressEntryDTO,
  GoalResponseDTO,
  ProgressLogCreateDTO,
} from 'packages/shared/dist/index.js';
import type {
  IGoalCompletionService,
  IGoalService,
} from '../interfaces/goal.interfaces.js';
import type { IProgressLogService } from '../interfaces/progress-log.interfaces.js';
import { AppServerError } from '../helpers/errors/app-server.errors.js';

export class GoalCompletionService implements IGoalCompletionService {
  private readonly goalService;
  private readonly progressLogService;
  constructor(
    goalService: IGoalService,
    progressLogService: IProgressLogService,
  ) {
    this.goalService = goalService;
    this.progressLogService = progressLogService;
  }

  async addProgressEntry(
    progressEntry: GoalProgressEntryDTO,
  ): Promise<GoalResponseDTO> {
    const goal = await this.goalService.findOneById(
      progressEntry.goalId,
      progressEntry.userId,
    );
    if (goal.type === 'qualitative' && progressEntry.value !== 1) {
      throw new AppServerError(
        'UNPROCESSABLE',
        "In progress entries for qualitative goals, 'value' must be 1.",
        [
          {
            field: 'value',
            message: 'Value cannot be different from 1 in qualitative goals.',
          },
        ],
      );
    }

    const log: ProgressLogCreateDTO = {
      userId: progressEntry.userId,
      habitId: null,
      goalId: progressEntry.goalId,
      date: progressEntry.date,
      value: progressEntry.value,
    };
    await this.progressLogService.create(log);

    const currValue =
      (
        await this.progressLogService.getGoalActivityStats(
          progressEntry.userId,
          progressEntry.goalId,
        )
      )[progressEntry.goalId] || 0;

    const updatedGoal: GoalResponseDTO = {
      ...goal,
      currentValue: currValue,
      isCompleted: currValue >= goal.targetValue,
    };

    return updatedGoal;
  }
}
