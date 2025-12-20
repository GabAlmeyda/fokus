import type { CreateCategoryDTO } from 'packages/shared/dist/index.js';
import type { ICategoryRepository } from '../interfaces/category-interfaces.js';
import {
  CategoryModel,
  type CategoryDocument,
} from '../models/category-model.js';
import { MongoRepositoryError } from '../helpers/mongo-errors.js';

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
}
