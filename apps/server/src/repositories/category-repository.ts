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
import { DatabaseError } from '../helpers/database-error.js';

export class CategoryRepository implements ICategoryRepository {
  async create(category: CreateCategoryDTO): Promise<CategoryDocument> {
    try {
      const createdCategoryDoc = await CategoryModel.create(category);

      return createdCategoryDoc;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }

  async findOneById(
    categoryId: MongoIdDTO,
    userId: MongoIdDTO,
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

  async findOneByName(
    name: string,
    userId: MongoIdDTO,
  ): Promise<CategoryDocument | null> {
    try {
      const categoryDoc = await CategoryModel.findOne({
        userId,
        name,
      });

      return categoryDoc;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }

  async findAll(userId: MongoIdDTO): Promise<CategoryDocument[]> {
    try {
      const categoryDocs = await CategoryModel.find({
        userId,
      });

      return categoryDocs;
    } catch (err) {
      throw DatabaseError.fromMongoose(err);
    }
  }

  async update(
    newData: UpdateCategoryDTO,
    categoryId: MongoIdDTO,
    userId: MongoIdDTO,
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
    categoryId: MongoIdDTO,
    userId: MongoIdDTO,
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
