import {
  CreateCategorySchema,
  formatZodError,
  type CreateCategoryDTO,
} from 'packages/shared/dist/index.js';
import type { ICategoryService } from '../interfaces/category-interfaces.js';
import type { CategoryDocument } from '../models/category-model.js';
import { CategoryRepository } from '../repositories/category-repository.js';
import { ServiceError } from '../helpers/service-errors.js';
import { MongoRepositoryError } from '../helpers/mongo-errors.js';

export class CategoryService implements ICategoryService {
  private readonly categoryRepository = new CategoryRepository();

  async createCategory(
    category?: CreateCategoryDTO,
  ): Promise<CategoryDocument> {
    try {
      const validation = CreateCategorySchema.safeParse(category);
      if (!validation.success) {
        const { errorType, message, invalidFields } = formatZodError(
          validation.error,
        );

        throw new ServiceError(errorType, message, invalidFields);
      }

      const createdCategoryDoc = await this.categoryRepository.createCategory(
        validation.data,
      );
      return createdCategoryDoc;
    } catch (err) {
      if (err instanceof MongoRepositoryError) {
        throw new ServiceError(err.errorType, err.message, err.invalidFields);
      }

      if (err instanceof ServiceError) {
        throw err;
      }

      throw new ServiceError('INTERNAL_SERVER_ERROR', 'Unexpected error.');
    }
  }
}
