import type {
  CreateCategoryDTO,
  UpdateCategoryDTO,
  HTTPRequest,
  ResponseCategoryDTO,
  HTTPResponse,
  EntityIdDTO,
  CategoryFilterDTO,
} from '@fokus/shared';
import type { CategoryDocument } from '../models/category-model.js';

export interface ICategoryRepository {
  create(category: CreateCategoryDTO): Promise<CategoryDocument>;

  findOneById(
    categoryId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<CategoryDocument | null>;

  findByFilter(
    filter: CategoryFilterDTO,
    userId: string,
  ): Promise<CategoryDocument[]>;

  update(
    newData: UpdateCategoryDTO,
    categoryId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<CategoryDocument | null>;

  delete(
    categoryId: string,
    userId: EntityIdDTO,
  ): Promise<CategoryDocument | null>;
}

export interface ICategoryService {
  create(category: CreateCategoryDTO): Promise<CategoryDocument>;

  findOneById(
    categoryId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<CategoryDocument>;

  findByFilter(
    filter: CategoryFilterDTO,
    userId: string,
  ): Promise<CategoryDocument[]>;

  update(
    newData: UpdateCategoryDTO,
    categoryId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<CategoryDocument>;

  delete(categoryId: EntityIdDTO, userId: EntityIdDTO): Promise<void>;
}

export interface ICategoryController {
  create(
    req: HTTPRequest<Omit<CreateCategoryDTO, 'userId'>>,
  ): Promise<HTTPResponse<ResponseCategoryDTO>>;

  findOneById(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<ResponseCategoryDTO>>;

  findByFilter(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<ResponseCategoryDTO[]>>;

  update(
    req: HTTPRequest<UpdateCategoryDTO>,
  ): Promise<HTTPResponse<ResponseCategoryDTO>>;

  delete(req: HTTPRequest<null>): Promise<HTTPResponse<null>>;
}
