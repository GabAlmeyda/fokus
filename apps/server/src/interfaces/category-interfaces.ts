import type {
  CreateCategoryDTO,
  UpdateCategoryDTO,
  HTTPRequest,
  ResponseCategoryDTO,
} from 'packages/shared/dist/index.js';
import type { CategoryDocument } from '../models/category-model.js';
import type { Types } from 'mongoose';
import type { HTTPResponse } from '../types/controller-types.js';

export interface ICategoryRepository {
  create(category: CreateCategoryDTO): Promise<CategoryDocument>;

  findOneByIdAndUser(
    categoryId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<CategoryDocument | null>;

  findOneByUserAndName(
    userId: Types.ObjectId,
    name: string,
  ): Promise<CategoryDocument | null>;

  findAllByUser(userId: Types.ObjectId): Promise<CategoryDocument[]>;

  update(
    newData: UpdateCategoryDTO,
    categoryId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<CategoryDocument | null>;

  delete(
    categoryId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<CategoryDocument | null>;
}

export interface ICategoryService {
  create(category?: CreateCategoryDTO): Promise<CategoryDocument>;

  findOneByIdAndUser(
    categoryId?: string,
    userId?: string,
  ): Promise<CategoryDocument>;

  findOneByUserAndName(
    userId?: string,
    name?: string,
  ): Promise<CategoryDocument>;

  findAllByUser(userId?: string): Promise<CategoryDocument[]>;

  update(
    newData?: UpdateCategoryDTO,
    categoryId?: string,
    userId?: string,
  ): Promise<CategoryDocument>;

  delete(categoryId?: string, userId?: string): Promise<CategoryDocument>;
}

export interface ICategoryController {
  create(
    req: HTTPRequest<CreateCategoryDTO>,
  ): Promise<HTTPResponse<ResponseCategoryDTO>>;

  findOneByIdAndUser(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<ResponseCategoryDTO>>;

  findOneByUserAndName(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<ResponseCategoryDTO>>;

  findAllByUser(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<ResponseCategoryDTO[]>>;

  update(
    req: HTTPRequest<UpdateCategoryDTO>,
  ): Promise<HTTPResponse<ResponseCategoryDTO>>;

  delete(req: HTTPRequest<null>): Promise<HTTPResponse<ResponseCategoryDTO>>;
}
