import type {
  CreateCategoryDTO,
  HTTPErrorResponse,
  HTTPRequest,
  HTTPSuccessResponse,
  ResponseCategoryDTO,
} from 'packages/shared/dist/index.js';
import type { CategoryDocument } from '../models/category-model.js';
import type { Types } from 'mongoose';

export interface ICategoryRepository {
  createCategory(category: CreateCategoryDTO): Promise<CategoryDocument>;

  findCategoryById(
    categoryId: Types.ObjectId,
  ): Promise<CategoryDocument | null>;

  // findCategoryByUserAndName(
  //   userId: Types.ObjectId,
  //   name: string,
  // ): Promise<CategoryDocument | null>;
}

export interface ICategoryService {
  createCategory(category?: CreateCategoryDTO): Promise<CategoryDocument>;

  findCategoryById(categoryId?: string): Promise<CategoryDocument>;

  // findCategoryByUserAndName(
  //   userId?: string,
  //   name?: string,
  // ): Promise<CategoryDocument>;
}

export interface ICategoryController {
  createCategory(
    req: HTTPRequest<CreateCategoryDTO>,
  ): Promise<HTTPSuccessResponse<ResponseCategoryDTO> | HTTPErrorResponse>;

  findCategoryById(
    req: HTTPRequest<null>,
  ): Promise<HTTPSuccessResponse<ResponseCategoryDTO> | HTTPErrorResponse>;

  // findCategoryByUserAndName(
  //   req: HTTPRequest<null>,
  // ): Promise<HTTPSuccessResponse<ResponseCategoryDTO> | HTTPErrorResponse>;
}
