import {
  UpdateGoalSchema,
  type CreateGoalDTO,
  type GoalFilterDTO,
  type MongoIdDTO,
  type UpdateGoalDTO,
} from '@fokus/shared';
import type { IGoalService } from '../interfaces/goal-interfaces.js';
import type { GoalDocument } from '../models/goal-model.js';
import { GoalRepository } from '../repositories/goal-repository.js';
import { AppServerError } from '../helpers/app-server-error.js';
import { MongoRepositoryError } from '../helpers/mongo-repository-error.js';

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

  async update(
    goalId: MongoIdDTO,
    newData: UpdateGoalDTO,
    userId: MongoIdDTO,
  ): Promise<GoalDocument> {
    // Verifies if the goal exists
    const currentGoalDoc = await this.goalRepository.findOneById(
      goalId,
      userId,
    );
    if (!currentGoalDoc) {
      throw new AppServerError(
        'NOT_FOUND',
        `Goal with ID '${goalId}' not found.`,
      );
    }

    // Validate the provided data
    const mergedGoal = { ...currentGoalDoc.toObject(), ...newData };
    mergedGoal.categoryId = mergedGoal.categoryId?.toString() ?? null;
    UpdateGoalSchema.parse(mergedGoal);

    try {
      const updatedGoalDoc = await this.goalRepository.update(
        goalId,
        newData,
        userId,
      );
      if (!updatedGoalDoc) {
        throw new AppServerError(
          'NOT_FOUND',
          `Goal with ID '${goalId}' not found.`,
        );
      }

      return updatedGoalDoc;
    } catch (err) {
      if (err instanceof MongoRepositoryError && err.errorType === 'CONFLICT') {
        throw new AppServerError(
          'CONFLICT',
          `Goal with title '${newData.title}' already exists.`,
          [{ field: 'title', message: 'Value is already registered.' }],
        );
      }

      throw err;
    }
  }

  async delete(goalId: MongoIdDTO, userId: MongoIdDTO): Promise<GoalDocument> {
    const deletedGoalDoc = await this.goalRepository.delete(goalId, userId);
    if (!deletedGoalDoc) {
      throw new AppServerError(
        'NOT_FOUND',
        `Goal with ID '${goalId}' not found.`,
      );
    }

    return deletedGoalDoc;
  }
}
