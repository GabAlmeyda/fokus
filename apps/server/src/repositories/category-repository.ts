import type {
  CreateCategoryDTO,
  UpdateCategoryDTO,
  MongoIdDTO,
} from '@fokus/shared';
import type { ICategoryRepository } from '../interfaces/category-interfaces.js';
import {
  CategoryModel,
  type CategoryDocument,
} from '../models/category-model.js';
import { MongoRepositoryError } from '../helpers/mongo-repository-error.js';

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
    categoryId: MongoIdDTO,
    userId: MongoIdDTO,
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

  async findOneByNameAndUser(
    name: string,
    userId: MongoIdDTO,
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

  async findAllByUser(userId: MongoIdDTO): Promise<CategoryDocument[]> {
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
    categoryId: MongoIdDTO,
    userId: MongoIdDTO,
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
    categoryId: MongoIdDTO,
    userId: MongoIdDTO,
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
