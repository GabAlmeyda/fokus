import type {
  CreateCategoryDTO,
  UpdateCategoryDTO,
  EntityIdDTO,
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

  async findOneByName(
    name: string,
    userId: EntityIdDTO,
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

  async findAll(userId: EntityIdDTO): Promise<CategoryDocument[]> {
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
