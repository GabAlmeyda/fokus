import {
  type HTTPRequest,
  type CreateCategoryDTO,
  type ResponseCategoryDTO,
  HTTPStatusCode,
  type UpdateCategoryDTO,
  type HTTPResponse,
  CreateCategorySchema,
  MongoIdSchema,
  UpdateCategorySchema,
} from '@fokus/shared';
import type { ICategoryController } from '../interfaces/category-interfaces.js';
import { CategoryService } from '../services/category-service.js';
import { mapCategoryDocToPublicDTO } from '../helpers/mappers.js';
import { formatHTTPErrorResponse } from '../helpers/controller-helpers.js';
import { AppServerError } from '../helpers/app-server-error.js';

export class CategoryController implements ICategoryController {
  private readonly categoryService = new CategoryService();

  async create(
    req: HTTPRequest<Omit<CreateCategoryDTO, 'userId'>>,
  ): Promise<HTTPResponse<ResponseCategoryDTO>> {
    try {
      const category = CreateCategorySchema.parse({
        ...req.body,
        userId: req.userId,
      });

      const createdCategoryDoc = await this.categoryService.create(category);
      const createdCategory = mapCategoryDocToPublicDTO(createdCategoryDoc);

      return {
        statusCode: HTTPStatusCode.CREATED,
        body: createdCategory,
      };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }

  async findOneByIdAndUser(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<ResponseCategoryDTO>> {
    try {
      const categoryId = MongoIdSchema.parse(req.params?.categoryId);
      const userId = MongoIdSchema.parse(req.userId);

      const categoryDoc = await this.categoryService.findOneByIdAndUser(
        categoryId,
        userId,
      );
      const category = mapCategoryDocToPublicDTO(categoryDoc);

      return {
        statusCode: HTTPStatusCode.OK,
        body: category,
      };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }

  async findOneByUserAndName(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<ResponseCategoryDTO>> {
    try {
      const userId = MongoIdSchema.parse(req.userId);

      const name = req.params?.name;
      if (!name) {
        throw new AppServerError(
          'BAD_REQUEST',
          'Name of the collection not provided.',
        );
      }

      const categoryDoc = await this.categoryService.findOneByUserAndName(
        userId,
        name,
      );
      const category = mapCategoryDocToPublicDTO(categoryDoc);

      return { statusCode: HTTPStatusCode.OK, body: category };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }

  async findAllByUser(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<ResponseCategoryDTO[]>> {
    try {
      const userId = MongoIdSchema.parse(req.userId);

      const categoryDocs = await this.categoryService.findAllByUser(userId);
      const categories = categoryDocs.map((c) => mapCategoryDocToPublicDTO(c));

      return { statusCode: HTTPStatusCode.OK, body: categories };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }

  async update(
    req: HTTPRequest<UpdateCategoryDTO>,
  ): Promise<HTTPResponse<ResponseCategoryDTO>> {
    try {
      const newData = UpdateCategorySchema.parse(req.body);
      const categoryId = MongoIdSchema.parse(req.params?.categoryId);
      const userId = MongoIdSchema.parse(req.userId);

      const updatedCategoryDoc = await this.categoryService.update(
        newData,
        categoryId,
        userId,
      );
      const updatedCategory = mapCategoryDocToPublicDTO(updatedCategoryDoc);

      return { statusCode: HTTPStatusCode.OK, body: updatedCategory };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }

  async delete(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<ResponseCategoryDTO>> {
    try {
      const categoryId = MongoIdSchema.parse(req.params?.categoryId);
      const userId = MongoIdSchema.parse(req.userId);

      const deletedCategoryDoc = await this.categoryService.delete(
        categoryId,
        userId,
      );
      const deletedCategory = mapCategoryDocToPublicDTO(deletedCategoryDoc);

      return { statusCode: HTTPStatusCode.OK, body: deletedCategory };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }
}
