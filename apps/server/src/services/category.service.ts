import {
  type CategoryFilterDTO,
  type CategoryCreateDTO,
  type EntityIdDTO,
  type CategoryUpdateDTO,
  type CategoryResponseDTO,
} from '@fokus/shared';
import type { ICategoryService } from '../interfaces/category.interfaces.js';
import { CategoryRepository } from '../repositories/category.repository.js';
import { AppServerError } from '../helpers/errors/app-server.errors.js';
import { DatabaseError } from '../helpers/errors/database.errors.js';
import { mapCategoryDocToPublicDTO } from '../helpers/mappers.js';

export class CategoryService implements ICategoryService {
  private readonly categoryRepository = new CategoryRepository();

  async create(newData: CategoryCreateDTO): Promise<CategoryResponseDTO> {
    try {
      const categoryDoc = await this.categoryRepository.create(newData);

      const category = mapCategoryDocToPublicDTO(categoryDoc);
      return category;
    } catch (err) {
      if (err instanceof DatabaseError && err.isConflict) {
        throw new AppServerError(
          'CONFLICT',
          `Category with name '${newData.name}' already exists.`,
          [{ field: 'name', message: 'Value is already registered.' }],
        );
      }

      throw err;
    }
  }

  async findOneById(
    categoryId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<CategoryResponseDTO> {
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

    const category = mapCategoryDocToPublicDTO(categoryDoc);
    return category;
  }

  async findByFilter(
    filter: CategoryFilterDTO,
    userId: string,
  ): Promise<CategoryResponseDTO[]> {
    const categoryDocs = await this.categoryRepository.findByFilter(
      filter,
      userId,
    );

    const categories = categoryDocs.map((c) => mapCategoryDocToPublicDTO(c));
    return categories;
  }

  async update(
    newData: CategoryUpdateDTO,
    categoryId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<CategoryResponseDTO> {
    const categoryDoc = await this.categoryRepository.update(
      newData,
      categoryId,
      userId,
    );
    if (!categoryDoc) {
      throw new AppServerError(
        'NOT_FOUND',
        `Category with id '${categoryId}' not found.`,
      );
    }

    const category = mapCategoryDocToPublicDTO(categoryDoc);
    return category;
  }

  async delete(categoryId: EntityIdDTO, userId: EntityIdDTO): Promise<void> {
    const categoryDoc = await this.categoryRepository.delete(
      categoryId,
      userId,
    );
    if (!categoryDoc) {
      throw new AppServerError(
        'NOT_FOUND',
        `Category with ID '${categoryId}' not found.`,
      );
    }
  }
}
