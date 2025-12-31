import type {
  CreateCategoryDTO,
  UpdateCategoryDTO,
  HTTPRequest,
  ResponseCategoryDTO,
  HTTPResponse,
  MongoIdDTO,
} from '@fokus/shared';
import type { CategoryDocument } from '../models/category-model.js';

export interface ICategoryRepository {
  create(category: CreateCategoryDTO): Promise<CategoryDocument>;

  findOneById(
    categoryId: MongoIdDTO,
    userId: MongoIdDTO,
  ): Promise<CategoryDocument | null>;

  findOneByName(
    userId: MongoIdDTO,
    name: string,
  ): Promise<CategoryDocument | null>;

  findAll(userId: MongoIdDTO): Promise<CategoryDocument[]>;

  update(
    newData: UpdateCategoryDTO,
    categoryId: MongoIdDTO,
    userId: MongoIdDTO,
  ): Promise<CategoryDocument | null>;

  delete(
    categoryId: string,
    userId: MongoIdDTO,
  ): Promise<CategoryDocument | null>;
}

export interface ICategoryService {
  create(category: CreateCategoryDTO): Promise<CategoryDocument>;

  findOneById(
    categoryId: MongoIdDTO,
    userId: MongoIdDTO,
  ): Promise<CategoryDocument>;

  findOneByName(userId: MongoIdDTO, name: string): Promise<CategoryDocument>;

  findAll(userId?: string): Promise<CategoryDocument[]>;

  update(
    newData: UpdateCategoryDTO,
    categoryId: MongoIdDTO,
    userId: MongoIdDTO,
  ): Promise<CategoryDocument>;

  delete(categoryId: MongoIdDTO, userId: MongoIdDTO): Promise<void>;
}

export interface ICategoryController {
  create(
    req: HTTPRequest<Omit<CreateCategoryDTO, 'userId'>>,
  ): Promise<HTTPResponse<ResponseCategoryDTO>>;

  findOneById(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<ResponseCategoryDTO>>;

  findOneByName(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<ResponseCategoryDTO>>;

  findAll(req: HTTPRequest<null>): Promise<HTTPResponse<ResponseCategoryDTO[]>>;

  update(
    req: HTTPRequest<UpdateCategoryDTO>,
  ): Promise<HTTPResponse<ResponseCategoryDTO>>;

  delete(req: HTTPRequest<null>): Promise<HTTPResponse<null>>;
}
