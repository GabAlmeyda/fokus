import {
  type CreateCategoryDTO,
  type MongoIdDTO,
  type UpdateCategoryDTO,
} from '@fokus/shared';
import type { ICategoryService } from '../interfaces/category-interfaces.js';
import type { CategoryDocument } from '../models/category-model.js';
import { CategoryRepository } from '../repositories/category-repository.js';
import { AppServerError } from '../helpers/app-server-error.js';

export class CategoryService implements ICategoryService {
  private readonly categoryRepository = new CategoryRepository();

  async create(category: CreateCategoryDTO): Promise<CategoryDocument> {
    const categoryDoc = await this.categoryRepository.findOneByName(
      category.name,
      category.userId,
    );
    if (categoryDoc) {
      throw new AppServerError(
        'CONFLICT',
        `Category with name '${categoryDoc.name}' already exists.`,
        [{ field: 'name', message: 'Value is already registered.' }],
      );
    }

    const createdCategoryDoc = await this.categoryRepository.create(category);
    return createdCategoryDoc;
  }

  async findOneById(
    categoryId: MongoIdDTO,
    userId: MongoIdDTO,
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

  async findOneByName(
    userId: MongoIdDTO,
    name: string,
  ): Promise<CategoryDocument> {
    const categoryDoc = await this.categoryRepository.findOneByName(
      name,
      userId,
    );
    if (!categoryDoc) {
      throw new AppServerError(
        'NOT_FOUND',
        `Category with name '${name}' not found.`,
      );
    }

    return categoryDoc;
  }

  async findAll(userId: MongoIdDTO): Promise<CategoryDocument[]> {
    const categoryDocs = await this.categoryRepository.findAll(userId);

    return categoryDocs;
  }

  async update(
    newData: UpdateCategoryDTO,
    categoryId: MongoIdDTO,
    userId: MongoIdDTO,
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

  async delete(categoryId: MongoIdDTO, userId: MongoIdDTO): Promise<void> {
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
