import { UserRepository } from '../repositories/user.repository.js';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository.js';
import { CategoryRepository } from '../repositories/category.repository.js';
import { HabitRepository } from '../repositories/habit.repository.js';
import { GoalRepository } from '../repositories/goal.repository.js';
import { ProgressLogRepository } from '../repositories/progress-log.repository.js';

import { UserService } from '../services/user.service.js';
import { RefreshTokenService } from '../services/refresh-token.service.js';
import { CategoryService } from '../services/category.service.js';
import { HabitService } from '../services/habit.service.js';
import { HabitCompletionService } from '../services/habit-completion.service.js';
import { GoalService } from '../services/goal.services.js';
import { ProgressLogService } from '../services/progress-log.services.js';

import { UserController } from '../controllers/user.controller.js';
import { CategoryController } from '../controllers/category.controller.js';
import { HabitController } from '../controllers/habit.controller.js';
import { GoalController } from '../controllers/goal.controller.js';
import { GoalCompletionService } from '../services/goal-completion.service.js';

// Repositories
export const userRepository = new UserRepository();
export const refreshTokenRepository = new RefreshTokenRepository();
export const categoryRepository = new CategoryRepository();
export const habitRepository = new HabitRepository();
export const goalRepository = new GoalRepository();
export const progressLogRepository = new ProgressLogRepository();

// Services
export const refreskTokenService = new RefreshTokenService(
  refreshTokenRepository,
);
export const userService = new UserService(userRepository, refreskTokenService);
export const categoryService = new CategoryService(categoryRepository);
export const progressLogService = new ProgressLogService(progressLogRepository);
export const habitService = new HabitService(
  habitRepository,
  progressLogService,
);
export const goalService = new GoalService(
  goalRepository,
  habitService,
  progressLogService,
);
export const goalCompletionService = new GoalCompletionService(
  goalService,
  progressLogService,
);
export const habitCompletionService = new HabitCompletionService(
  habitService,
  goalService,
  progressLogService,
);

// Controllers
export const userController = new UserController(userService);
export const categoryController = new CategoryController(categoryService);
export const habitController = new HabitController(
  habitService,
  habitCompletionService,
);
export const goalController = new GoalController(
  goalService,
  goalCompletionService,
);
