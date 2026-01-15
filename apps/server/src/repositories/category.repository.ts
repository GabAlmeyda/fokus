import type {
  CategoryCreateDTO,
  CategoryUpdateDTO,
  EntityIdDTO,
  CategoryFilterDTO,
} from '@fokus/shared';
import type { ICategoryRepository } from '../interfaces/category.interfaces.js';
import {
  CategoryModel,
  type CategoryDocument,
} from '../models/category.model.js';
import { DatabaseError } from '../helpers/errors/database.errors.js';

export class CategoryRepository implements ICategoryRepository {
  async create(category: CategoryCreateDTO): Promise<CategoryDocument> {
    try {
      const createdCategoryDoc = await CategoryModel.create(category);

      return createdCategoryDoc;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }

  async findOneById(
    categoryId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<CategoryDocument | null> {
    try {
      const categoryDoc = await CategoryModel.findOne({
        _id: categoryId,
        userId,
      });

      return categoryDoc;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }

  async findByFilter(
    filter: CategoryFilterDTO,
    userId: string,
  ): Promise<CategoryDocument[]> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const query: Record<string, any> = { userId };

      const property = Object.keys(filter).find(
        (k) => typeof filter[k as keyof CategoryFilterDTO] !== 'undefined',
      ) as keyof CategoryFilterDTO | undefined;

      switch (property) {
        case 'name':
          query[property] = filter[property];
          break;

        case undefined:
          break;

        default: {
          const exhaustiveCheck: never = property;
          throw new Error(
            `[category-repository.ts (server)] Unhandled case '${exhaustiveCheck}'.`,
          );
        }
      }

      const returnedDocs = CategoryModel.find(query);
      return returnedDocs;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }

  async update(
    newData: CategoryUpdateDTO,
    categoryId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<CategoryDocument | null> {
    try {
      const updatedCategoryDoc = await CategoryModel.findOneAndUpdate(
        { _id: categoryId, userId },
        { $set: newData },
        { new: true, runValidators: true },
      );

      return updatedCategoryDoc;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }

  async delete(
    categoryId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<CategoryDocument | null> {
    try {
      const deletedCategoryDoc = await CategoryModel.findOneAndDelete({
        _id: categoryId,
        userId,
      });

      return deletedCategoryDoc;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }
}
