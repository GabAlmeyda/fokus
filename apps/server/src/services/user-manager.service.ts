import type { EntityIdDTO } from '@fokus/shared';
import type {
  IUserManagerService,
  IUserService,
} from '../interfaces/user.interfaces.js';
import type { IHabitService } from '../interfaces/habit.interfaces.js';
import type { IGoalService } from '../interfaces/goal.interfaces.js';
import type { ICategoryService } from '../interfaces/category.interfaces.js';

export class UserManagerService implements IUserManagerService {
  private readonly userService;
  private readonly habitService;
  private readonly goalService;
  private readonly categoryService;
  constructor(
    userService: IUserService,
    habitService: IHabitService,
    goalService: IGoalService,
    categoryService: ICategoryService,
  ) {
    this.userService = userService;
    this.habitService = habitService;
    this.goalService = goalService;
    this.categoryService = categoryService;
  }
  async deleteCompletely(userId: EntityIdDTO): Promise<void> {
    await this.userService.delete(userId);
    await this.categoryService.deleteByUserId(userId);
    await this.habitService.deleteByUserId(userId);
    await this.goalService.deleteByUserId(userId);
  }
}
