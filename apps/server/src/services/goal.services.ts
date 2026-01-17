import {
  GoalUpdateSchema,
  type GoalCreateDTO,
  type GoalFilterDTO,
  type EntityIdDTO,
  type GoalUpdateDTO,
} from '@fokus/shared';
import type { IGoalService } from '../interfaces/goal.interfaces.js';
import type { GoalDocument } from '../models/goal.model.js';
import { GoalRepository } from '../repositories/goal.repository.js';
import { AppServerError } from '../helpers/errors/app-server.errors.js';
import { DatabaseError } from '../helpers/errors/database.errors.js';

export class GoalService implements IGoalService {
  private readonly goalRepository = new GoalRepository();

  async create(goal: GoalCreateDTO): Promise<GoalDocument> {
    const goalToCreate: GoalCreateDTO & { currentValue: number | null } = {
      ...goal,
      currentValue: null,
    };
    if (goalToCreate.type === 'quantitative') {
      goalToCreate.currentValue = 0;
    }

    try {
      const createdGoalDoc = await this.goalRepository.create(goalToCreate);
      return createdGoalDoc;
    } catch (err) {
      if (err instanceof DatabaseError && err.isConflict) {
        throw new AppServerError(
          'CONFLICT',
          `Goal with title '${goal.title}' already exists.`,
          [{ field: 'title', message: 'Value is already registered.' }],
        );
      }

      throw err;
    }
  }

  async findOneById(
    goalId: EntityIdDTO,
    userId: EntityIdDTO,
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
    userId: EntityIdDTO,
  ): Promise<GoalDocument[]> {
    const goalDocs = await this.goalRepository.findByFilter(filter, userId);

    return goalDocs;
  }

  async update(
    goalId: EntityIdDTO,
    newData: GoalUpdateDTO,
    userId: EntityIdDTO,
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
    GoalUpdateSchema.parse(mergedGoal);

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
      if (err instanceof DatabaseError && err.isConflict) {
        throw new AppServerError(
          'CONFLICT',
          `Goal with title '${newData.title}' already exists.`,
          [{ field: 'title', message: 'Value is already registered.' }],
        );
      }

      throw err;
    }
  }

  async delete(
    goalId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<GoalDocument> {
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
