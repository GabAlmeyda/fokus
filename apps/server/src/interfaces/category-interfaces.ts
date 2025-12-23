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
  create(category: CreateCategoryDTO): Promise<CategoryDocument>;

  findOneByIdAndUser(
    categoryId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<CategoryDocument | null>;

  findOneByUserAndName(
    userId: Types.ObjectId,
    name: string,
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
}

export interface ICategoryController {
  create(
    req: HTTPRequest<CreateCategoryDTO>,
  ): Promise<HTTPSuccessResponse<ResponseCategoryDTO> | HTTPErrorResponse>;

  findOneByIdAndUser(
    req: HTTPRequest<null>,
  ): Promise<HTTPSuccessResponse<ResponseCategoryDTO> | HTTPErrorResponse>;

  findOneByUserAndName(
    req: HTTPRequest<null>,
  ): Promise<HTTPSuccessResponse<ResponseCategoryDTO> | HTTPErrorResponse>;
}
