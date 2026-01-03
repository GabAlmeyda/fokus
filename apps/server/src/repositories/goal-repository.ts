import type { CreateGoalDTO, MongoIdDTO } from '@fokus/shared';
import type { IGoalRepository } from '../interfaces/goal-interfaces.js';
import { GoalModel, type GoalDocument } from '../models/goal-model.js';
import { MongoRepositoryError } from '../helpers/mongo-repository-error.js';
import { Types } from 'mongoose';

export class GoalRepository implements IGoalRepository {
  async create(
    goal: CreateGoalDTO & { currentValue: number | null },
  ): Promise<GoalDocument> {
    try {
      const goalToCreate = {
        ...goal,
        categoryId: goal.categoryId
          ? new Types.ObjectId(goal.categoryId)
          : null,
        habits: goal.habits.map((h) => new Types.ObjectId(h)),
      };
      const createdGoalDoc = await GoalModel.create(goalToCreate);

      return createdGoalDoc;
    } catch (err) {
      throw MongoRepositoryError.fromMongoose(err);
    }
  }

  async findAll(userId: MongoIdDTO): Promise<GoalDocument[]> {
    try {
      const goalDocs = await GoalModel.find({ userId });

      return goalDocs;
    } catch (err) {
      throw MongoRepositoryError.fromMongoose(err);
    }
  }
}
