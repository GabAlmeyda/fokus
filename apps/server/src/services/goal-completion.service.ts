import type {
  EntityIdDTO,
  GoalProgressLogDTO,
  GoalResponseDTO,
  ProgressLogCreateDTO,
} from '@fokus/shared';
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

  async addProgressLog(
    progressLog: GoalProgressLogDTO,
  ): Promise<{ updatedGoal: GoalResponseDTO; progressLogId: EntityIdDTO }> {
    const goal = await this.goalService.findOneById(
      progressLog.goalId,
      progressLog.userId,
    );
    if (goal.type === 'qualitative' && goal.isCompleted) {
      throw new AppServerError(
        'CONFLICT',
        "Cannot have more than one goal progress log for a goal with type 'qualitative'.",
      );
    }

    if (goal.type === 'qualitative' && progressLog.value !== 1) {
      throw new AppServerError(
        'UNPROCESSABLE',
        "In progress logs for qualitative goals, 'value' must be 1.",
        [
          {
            field: 'value',
            message: 'Value cannot be different from 1 in qualitative goals.',
          },
        ],
      );
    }

    const logData: ProgressLogCreateDTO = {
      userId: goal.userId,
      goalId: goal.id,
      habitId: null,
      date: progressLog.date,
      value: progressLog.value,
    };
    const log = await this.progressLogService.create(logData);

    const currValue =
      (
        await this.progressLogService.getGoalActivityStats(goal.userId, goal.id)
      )[goal.id] || 0;

    const updatedGoal: GoalResponseDTO = {
      ...goal,
      currentValue: currValue,
      isCompleted: currValue >= goal.targetValue,
    };

    return { updatedGoal, progressLogId: log.id };
  }

  async removeProgressEntry(
    progressLogId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<GoalResponseDTO> {
    const log = await this.progressLogService.delete(progressLogId, userId);
    if (!log || !log.goalId) {
      throw new AppServerError(
        'NOT_FOUND',
        `Goal progress log with ID '${progressLogId}' not found.`,
      );
    }

    const goal = await this.goalService.findOneById(
      log.goalId.toString(),
      userId,
    );
    return goal;
  }
}
