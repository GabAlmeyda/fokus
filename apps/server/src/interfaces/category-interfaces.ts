import type {
  CreateCategoryDTO,
  UpdateCategoryDTO,
  HTTPRequest,
  ResponseCategoryDTO,
  HTTPResponse,
} from '@fokus/shared';
import type { CategoryDocument } from '../models/category-model.js';

export interface ICategoryRepository {
  create(category: CreateCategoryDTO): Promise<CategoryDocument>;

  findOneByIdAndUser(
    categoryId: string,
    userId: string,
  ): Promise<CategoryDocument | null>;

  findOneByUserAndName(
    userId: string,
    name: string,
  ): Promise<CategoryDocument | null>;

  findAllByUser(userId: string): Promise<CategoryDocument[]>;

  update(
    newData: UpdateCategoryDTO,
    categoryId: string,
    userId: string,
  ): Promise<CategoryDocument | null>;

  delete(categoryId: string, userId: string): Promise<CategoryDocument | null>;
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
    req: HTTPRequest<Omit<CreateCategoryDTO, 'userId'>>,
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
