import type {
  CategoryCreateDTO,
  CategoryUpdateDTO,
  HTTPRequest,
  CategoryResponseDTO,
  HTTPResponse,
  EntityIdDTO,
  CategoryFilterDTO,
} from '@fokus/shared';
import type { CategoryDocument } from '../models/category.model.js';

export interface ICategoryRepository {
  create(newData: CategoryCreateDTO): Promise<CategoryDocument>;

  findOneById(
    categoryId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<CategoryDocument | null>;

  findByFilter(
    filter: CategoryFilterDTO,
    userId: string,
  ): Promise<CategoryDocument[]>;

  update(
    newData: CategoryUpdateDTO,
    categoryId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<CategoryDocument | null>;

  delete(
    categoryId: string,
    userId: EntityIdDTO,
  ): Promise<CategoryDocument | null>;
}

export interface ICategoryService {
  create(newData: CategoryCreateDTO): Promise<CategoryResponseDTO>;

  findOneById(
    categoryId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<CategoryResponseDTO>;

  findByFilter(
    filter: CategoryFilterDTO,
    userId: string,
  ): Promise<CategoryResponseDTO[]>;

  update(
    newData: CategoryUpdateDTO,
    categoryId: EntityIdDTO,
    userId: EntityIdDTO,
  ): Promise<CategoryResponseDTO>;

  delete(categoryId: EntityIdDTO, userId: EntityIdDTO): Promise<void>;
}

export interface ICategoryController {
  create(
    req: HTTPRequest<Omit<CategoryCreateDTO, 'userId'>>,
  ): Promise<HTTPResponse<CategoryResponseDTO>>;

  findOneById(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<CategoryResponseDTO>>;

  findByFilter(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<CategoryResponseDTO[]>>;

  update(
    req: HTTPRequest<CategoryUpdateDTO>,
  ): Promise<HTTPResponse<CategoryResponseDTO>>;

  delete(req: HTTPRequest<null>): Promise<HTTPResponse<null>>;
}
