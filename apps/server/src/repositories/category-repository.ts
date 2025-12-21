import type { CreateCategoryDTO } from 'packages/shared/dist/index.js';
import type { ICategoryRepository } from '../interfaces/category-interfaces.js';
import {
  CategoryModel,
  type CategoryDocument,
} from '../models/category-model.js';
import { MongoRepositoryError } from '../helpers/mongo-errors.js';
import type { Types } from 'mongoose';

export class CategoryRepository implements ICategoryRepository {
  async createCategory(category: CreateCategoryDTO): Promise<CategoryDocument> {
    try {
      const createdCategoryDoc: CategoryDocument =
        await CategoryModel.create(category);

      return createdCategoryDoc;
    } catch (err) {
      throw MongoRepositoryError.fromMongoose(err);
    }
  }

  async findCategoryById(
    categoryId: Types.ObjectId,
  ): Promise<CategoryDocument | null> {
    try {
      const categoryDoc: CategoryDocument | null =
        await CategoryModel.findById(categoryId);

      return categoryDoc;
    } catch (err) {
      throw MongoRepositoryError.fromMongoose(err);
    }
  }
}
