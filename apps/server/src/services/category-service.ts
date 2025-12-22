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
import { Types } from 'mongoose';

export class CategoryService implements ICategoryService {
  private readonly categoryRepository = new CategoryRepository();

  async create(category?: CreateCategoryDTO): Promise<CategoryDocument> {
    try {
      const validation = CreateCategorySchema.safeParse(category);
      if (!validation.success) {
        const { errorType, message, invalidFields } = formatZodError(
          validation.error,
        );

        throw new ServiceError(errorType, message, invalidFields);
      }

      const createdCategoryDoc = await this.categoryRepository.create(
        validation.data,
      );
      return createdCategoryDoc;
    } catch (err) {
      if (err instanceof MongoRepositoryError) {
        throw new ServiceError(err.errorType, err.message, err.invalidFields);
      }

      throw err;
    }
  }

  async findOneByIdAndUser(
    categoryId?: string,
    userId?: string,
  ): Promise<CategoryDocument> {
    try {
      if (
        typeof categoryId !== 'string' ||
        !Types.ObjectId.isValid(categoryId)
      ) {
        throw new ServiceError('BAD_REQUEST', 'Invalid category ID provided.');
      }
      if (typeof userId !== 'string') {
        throw new ServiceError('BAD_REQUEST', 'Invalid user ID provided.');
      }

      const categoryDoc = await this.categoryRepository.findOneByIdAndUser(
        new Types.ObjectId(categoryId),
        new Types.ObjectId(userId),
      );
      if (!categoryDoc) {
        throw new ServiceError(
          'NOT_FOUND',
          `Category with ID '${categoryId}' not found.`,
        );
      }

      return categoryDoc;
    } catch (err) {
      if (err instanceof MongoRepositoryError) {
        throw new ServiceError(err.errorType, err.message, err.invalidFields);
      }

      throw err;
    }
  }
}
