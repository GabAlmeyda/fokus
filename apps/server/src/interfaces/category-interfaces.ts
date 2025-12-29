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

  findOneByIdAndUser(
    categoryId: MongoIdDTO,
    userId: MongoIdDTO,
  ): Promise<CategoryDocument | null>;

  findOneByNameAndUser(
    userId: MongoIdDTO,
    name: string,
  ): Promise<CategoryDocument | null>;

  findAllByUser(userId: MongoIdDTO): Promise<CategoryDocument[]>;

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

  findOneByIdAndUser(
    categoryId: MongoIdDTO,
    userId: MongoIdDTO,
  ): Promise<CategoryDocument>;

  findOneByNameAndUser(
    userId: MongoIdDTO,
    name: string,
  ): Promise<CategoryDocument>;

  findAllByUser(userId?: string): Promise<CategoryDocument[]>;

  update(
    newData: UpdateCategoryDTO,
    categoryId: MongoIdDTO,
    userId: MongoIdDTO,
  ): Promise<CategoryDocument>;

  delete(categoryId: MongoIdDTO, userId: MongoIdDTO): Promise<CategoryDocument>;
}

export interface ICategoryController {
  create(
    req: HTTPRequest<Omit<CreateCategoryDTO, 'userId'>>,
  ): Promise<HTTPResponse<ResponseCategoryDTO>>;

  findOneByIdAndUser(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<ResponseCategoryDTO>>;

  findOneByNameAndUser(
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
