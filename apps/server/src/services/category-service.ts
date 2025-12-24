import {
  CreateCategorySchema,
  formatZodError,
  UpdateCategorySchema,
  type CreateCategoryDTO,
  type UpdateCategoryDTO,
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

  async findOneByUserAndName(
    userId?: string,
    name?: string,
  ): Promise<CategoryDocument> {
    try {
      if (typeof userId !== 'string' || !Types.ObjectId.isValid(userId)) {
        throw new ServiceError('BAD_REQUEST', 'Invalid user ID provided.');
      }
      if (!name || typeof name !== 'string') {
        throw new ServiceError(
          'BAD_REQUEST',
          'Invalid category name provided.',
        );
      }

      const categoryDoc = await this.categoryRepository.findOneByUserAndName(
        new Types.ObjectId(userId),
        name,
      );
      if (!categoryDoc) {
        throw new ServiceError(
          'NOT_FOUND',
          `Category with name '${name}' not found.`,
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

  async findAllByUser(userId?: string): Promise<CategoryDocument[]> {
    try {
      if (typeof userId !== 'string' || !Types.ObjectId.isValid(userId)) {
        throw new ServiceError('BAD_REQUEST', 'Invalid user ID provided.');
      }

      const categoryDocs = await this.categoryRepository.findAllByUser(
        new Types.ObjectId(userId),
      );

      return categoryDocs;
    } catch (err) {
      if (err instanceof MongoRepositoryError) {
        throw new ServiceError(err.errorType, err.message, err.invalidFields);
      }

      throw err;
    }
  }

  async update(
    newData?: UpdateCategoryDTO,
    categoryId?: string,
    userId?: string,
  ): Promise<CategoryDocument> {
    try {
      const validation = UpdateCategorySchema.safeParse(newData);
      if (!validation.success) {
        const { errorType, message, invalidFields } = formatZodError(
          validation.error,
        );

        throw new ServiceError(errorType, message, invalidFields);
      }

      if (
        typeof categoryId !== 'string' ||
        !Types.ObjectId.isValid(categoryId)
      ) {
        throw new ServiceError('BAD_REQUEST', 'Invalid category ID provided.');
      }

      if (typeof userId !== 'string' || !Types.ObjectId.isValid(userId)) {
        throw new ServiceError('BAD_REQUEST', 'Invalid user ID provided.');
      }

      const updatedCategoryDoc = await this.categoryRepository.update(
        validation.data,
        new Types.ObjectId(categoryId),
        new Types.ObjectId(userId),
      );
      if (!updatedCategoryDoc) {
        throw new ServiceError(
          'NOT_FOUND',
          `Category with id '${categoryId}' not found.`,
        );
      }

      return updatedCategoryDoc;
    } catch (err) {
      if (err instanceof MongoRepositoryError) {
        throw new ServiceError(err.errorType, err.message, err.invalidFields);
      }

      throw err;
    }
  }

  async delete(
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

      if (typeof userId !== 'string' || !Types.ObjectId.isValid(userId)) {
        throw new ServiceError('BAD_REQUEST', 'Invalid user ID provided.');
      }

      const deletedCategoryDoc = await this.categoryRepository.delete(
        new Types.ObjectId(categoryId),
        new Types.ObjectId(userId),
      );
      if (!deletedCategoryDoc) {
        throw new ServiceError(
          'NOT_FOUND',
          `Category with ID '${categoryId}' not found.`,
        );
      }

      return deletedCategoryDoc;
    } catch (err) {
      if (err instanceof MongoRepositoryError) {
        throw new ServiceError(err.errorType, err.message, err.invalidFields);
      }

      throw err;
    }
  }
}
