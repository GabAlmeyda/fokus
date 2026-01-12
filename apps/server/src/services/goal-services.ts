import type { CreateGoalDTO, GoalFilterDTO, MongoIdDTO } from '@fokus/shared';
import type { IGoalService } from '../interfaces/goal-interfaces.js';
import type { GoalDocument } from '../models/goal-model.js';
import { GoalRepository } from '../repositories/goal-repository.js';
import { AppServerError } from '../helpers/app-server-error.js';

export class GoalService implements IGoalService {
  private readonly goalRepository = new GoalRepository();

  async create(goal: CreateGoalDTO): Promise<GoalDocument> {
    const goalDoc = (
      await this.goalRepository.findByFilter({ title: goal.title }, goal.userId)
    )[0];
    if (goalDoc) {
      throw new AppServerError(
        'CONFLICT',
        `Goal with title '${goal.title}' already exists.`,
        [{ field: 'title', message: 'Value is already registered.' }],
      );
    }

    const goalToCreate: CreateGoalDTO & { currentValue: number | null } = {
      ...goal,
      currentValue: null,
    };
    if (goalToCreate.type === 'quantitative') {
      goalToCreate.currentValue = 0;
    }

    const createdGoalDoc = await this.goalRepository.create(goalToCreate);

    return createdGoalDoc;
  }

  async findAll(userId: MongoIdDTO): Promise<GoalDocument[]> {
    const goalDocs = await this.goalRepository.findAll(userId);

    return goalDocs;
  }

  async findOneById(
    goalId: MongoIdDTO,
    userId: MongoIdDTO,
  ): Promise<GoalDocument> {
    const goalDoc = await this.goalRepository.findOneById(goalId, userId);
    if (!goalDoc) {
      throw new AppServerError(
        'NOT_FOUND',
        `Goal with ID '${goalId}' not found.`,
      );
    }

    return goalDoc;
  }

  async findByFilter(
    filter: GoalFilterDTO,
    userId: MongoIdDTO,
  ): Promise<GoalDocument[]> {
    const ret = await this.goalRepository.findByFilter(filter, userId);

    return ret;
  }
}
