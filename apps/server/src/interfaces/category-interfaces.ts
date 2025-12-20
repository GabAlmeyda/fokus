import type {
  CreateCategoryDTO,
  HTTPErrorResponse,
  HTTPRequest,
  HTTPSuccessResponse,
  ResponseCategoryDTO,
} from 'packages/shared/dist/index.js';
import type { CategoryDocument } from '../models/category-model.js';

export interface ICategoryRepository {
  createCategory(category: CreateCategoryDTO): Promise<CategoryDocument>;
}

export interface ICategoryService {
  createCategory(category?: CreateCategoryDTO): Promise<CategoryDocument>;
}

export interface ICategoryController {
  createCategory(
    req?: HTTPRequest<CreateCategoryDTO>,
  ): Promise<HTTPSuccessResponse<ResponseCategoryDTO> | HTTPErrorResponse>;
}
