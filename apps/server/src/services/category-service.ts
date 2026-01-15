import {
  type CategoryFilterDTO,
  type CreateCategoryDTO,
  type EntityIdDTO,
  type UpdateCategoryDTO,
} from '@fokus/shared';
import type { ICategoryService } from '../interfaces/category-interfaces.js';
import type { CategoryDocument } from '../models/category-model.js';
import { CategoryRepository } from '../repositories/category-repository.js';
import { AppServerError } from '../helpers/app-server-error.js';
import { DatabaseError } from '../helpers/database-error.js';

export class CategoryService implements ICategoryService {
  private readonly categoryRepository = new CategoryRepository();

  async create(category: CreateCategoryDTO): Promise<CategoryDocument> {
    try {
      const createdCategoryDoc = await this.categoryRepository.create(category);
      return createdCategoryDoc;
    } catch (err) {
      if (err instanceof DatabaseError && err.isConflict) {
        throw new AppServerError(
          'CONFLICT',
          `Category with name '${category.name}' already exists.`,
          [{ field: 'name', message: 'Value is already registered.' }],
        );
      }

      throw err;
    }
  }

  async findOneById(
    categoryId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<CategoryDocument> {
    const categoryDoc = await this.categoryRepository.findOneById(
      categoryId,
      userId,
    );
    if (!categoryDoc) {
      throw new AppServerError(
        'NOT_FOUND',
        `Category with ID '${categoryId}' not found.`,
      );
    }

    return categoryDoc;
  }

  async findByFilter(
    filter: CategoryFilterDTO,
    userId: string,
  ): Promise<CategoryDocument[]> {
    const returnedDocs = await this.categoryRepository.findByFilter(
      filter,
      userId,
    );

    return returnedDocs;
  }

  async update(
    newData: UpdateCategoryDTO,
    categoryId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<CategoryDocument> {
    const updatedCategoryDoc = await this.categoryRepository.update(
      newData,
      categoryId,
      userId,
    );
    if (!updatedCategoryDoc) {
      throw new AppServerError(
        'NOT_FOUND',
        `Category with id '${categoryId}' not found.`,
      );
    }

    return updatedCategoryDoc;
  }

  async delete(categoryId: EntityIdDTO, userId: EntityIdDTO): Promise<void> {
    const deletedCategoryDoc = await this.categoryRepository.delete(
      categoryId,
      userId,
    );
    if (!deletedCategoryDoc) {
      throw new AppServerError(
        'NOT_FOUND',
        `Category with ID '${categoryId}' not found.`,
      );
    }
  }
}
