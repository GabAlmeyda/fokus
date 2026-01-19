import {
  GoalUpdateSchema,
  type GoalCreateDTO,
  type GoalFilterDTO,
  type EntityIdDTO,
  type GoalUpdateDTO,
  type GoalResponseDTO,
} from '@fokus/shared';
import type { IGoalService } from '../interfaces/goal.interfaces.js';
import { GoalRepository } from '../repositories/goal.repository.js';
import { AppServerError } from '../helpers/errors/app-server.errors.js';
import { DatabaseError } from '../helpers/errors/database.errors.js';
import { mapGoalDocToPublicDTO } from '../helpers/mappers.js';

export class GoalService implements IGoalService {
  private readonly goalRepository = new GoalRepository();

  async create(newData: GoalCreateDTO): Promise<GoalResponseDTO> {
    try {
      const goalDoc = await this.goalRepository.create(newData);

      const goal = mapGoalDocToPublicDTO(goalDoc);
      return goal;
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

  async findOneById(
    goalId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<GoalResponseDTO> {
    const goalDoc = await this.goalRepository.findOneById(goalId, userId);
    if (!goalDoc) {
      throw new AppServerError(
        'NOT_FOUND',
        `Goal with ID '${goalId}' not found.`,
      );
    }

    const goal = mapGoalDocToPublicDTO(goalDoc);
    return goal;
  }

  async findByFilter(
    filter: GoalFilterDTO,
    userId: EntityIdDTO,
  ): Promise<GoalResponseDTO[]> {
    const goalDocs = await this.goalRepository.findByFilter(filter, userId);

    const goals = goalDocs.map((g) => mapGoalDocToPublicDTO(g));
    return goals;
  }

  async update(
    goalId: EntityIdDTO,
    newData: GoalUpdateDTO,
    userId: EntityIdDTO,
  ): Promise<GoalResponseDTO> {
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
      const goalDoc = await this.goalRepository.update(goalId, newData, userId);
      if (!goalDoc) {
        throw new AppServerError(
          'NOT_FOUND',
          `Goal with ID '${goalId}' not found.`,
        );
      }

      const goal = mapGoalDocToPublicDTO(goalDoc);
      return goal;
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

  async delete(goalId: EntityIdDTO, userId: EntityIdDTO): Promise<null> {
    const goalDoc = await this.goalRepository.delete(goalId, userId);
    if (!goalDoc) {
      throw new AppServerError(
        'NOT_FOUND',
        `Goal with ID '${goalId}' not found.`,
      );
    }

    return null;
  }
}
