import type { CreateGoalDTO, MongoIdDTO } from '@fokus/shared';
import type { IGoalService } from '../interfaces/goal-interfaces.js';
import type { GoalDocument } from '../models/goal-model.js';
import { GoalRepository } from '../repositories/goal-repository.js';

export class GoalService implements IGoalService {
  private readonly goalRepository = new GoalRepository();

  async create(goal: CreateGoalDTO): Promise<GoalDocument> {
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
}
