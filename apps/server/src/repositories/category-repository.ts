import type {
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from 'packages/shared/dist/index.js';
import type { ICategoryRepository } from '../interfaces/category-interfaces.js';
import {
  CategoryModel,
  type CategoryDocument,
} from '../models/category-model.js';
import { MongoRepositoryError } from '../helpers/mongo-errors.js';

export class CategoryRepository implements ICategoryRepository {
  async create(category: CreateCategoryDTO): Promise<CategoryDocument> {
    try {
      const createdCategoryDoc: CategoryDocument =
        await CategoryModel.create(category);

      return createdCategoryDoc;
    } catch (err) {
      throw MongoRepositoryError.fromMongoose(err);
    }
  }

  async findOneByIdAndUser(
    categoryId: string,
    userId: string,
  ): Promise<CategoryDocument | null> {
    try {
      const categoryDoc: CategoryDocument | null = await CategoryModel.findOne({
        _id: categoryId,
        userId,
      });

      return categoryDoc;
    } catch (err) {
      throw MongoRepositoryError.fromMongoose(err);
    }
  }

  async findOneByUserAndName(
    userId: string,
    name: string,
  ): Promise<CategoryDocument | null> {
    try {
      const categoryDoc: CategoryDocument | null = await CategoryModel.findOne({
        userId,
        name,
      });

      return categoryDoc;
    } catch (err) {
      throw MongoRepositoryError.fromMongoose(err);
    }
  }

  async findAllByUser(userId: string): Promise<CategoryDocument[]> {
    try {
      const categoryDocs: CategoryDocument[] = await CategoryModel.find({
        userId,
      });

      return categoryDocs;
    } catch (err) {
      throw MongoRepositoryError.fromMongoose(err);
    }
  }

  async update(
    newData: UpdateCategoryDTO,
    categoryId: string,
    userId: string,
  ): Promise<CategoryDocument | null> {
    try {
      const updatedCategoryDoc: CategoryDocument | null =
        await CategoryModel.findOneAndUpdate(
          { _id: categoryId, userId },
          { $set: newData },
          { new: true, runValidators: true },
        );

      return updatedCategoryDoc;
    } catch (err) {
      throw MongoRepositoryError.fromMongoose(err);
    }
  }

  async delete(
    categoryId: string,
    userId: string,
  ): Promise<CategoryDocument | null> {
    try {
      const deletedCategoryDoc: CategoryDocument | null =
        await CategoryModel.findOneAndDelete({ _id: categoryId, userId });

      return deletedCategoryDoc;
    } catch (err) {
      throw MongoRepositoryError.fromMongoose(err);
    }
  }
}
