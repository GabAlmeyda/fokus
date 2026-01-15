import {
  type HTTPRequest,
  type CreateCategoryDTO,
  type ResponseCategoryDTO,
  HTTPStatusCode,
  type UpdateCategoryDTO,
  type HTTPResponse,
  CreateCategorySchema,
  EntityIdSchema,
  UpdateCategorySchema,
  CategoryFilterSchema,
} from '@fokus/shared';
import type { ICategoryController } from '../interfaces/category-interfaces.js';
import { CategoryService } from '../services/category-service.js';
import { mapCategoryDocToPublicDTO } from '../helpers/mappers.js';
import { formatHTTPErrorResponse } from '../helpers/controller-helpers.js';

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

  async findOneById(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<ResponseCategoryDTO>> {
    try {
      const categoryId = EntityIdSchema.parse(req.params?.categoryId);
      const userId = EntityIdSchema.parse(req.userId);

      const categoryDoc = await this.categoryService.findOneById(
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

  async findByFilter(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<ResponseCategoryDTO[]>> {
    try {
      const filter = CategoryFilterSchema.parse({
        name: req.query?.name,
      });
      const userId = EntityIdSchema.parse(req.userId);

      const returnedDocs = await this.categoryService.findByFilter(
        filter,
        userId,
      );
      const docs = returnedDocs.map((d) => mapCategoryDocToPublicDTO(d));

      return { statusCode: HTTPStatusCode.OK, body: docs };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }

  async update(
    req: HTTPRequest<UpdateCategoryDTO>,
  ): Promise<HTTPResponse<ResponseCategoryDTO>> {
    try {
      const newData = UpdateCategorySchema.parse(req.body);
      const categoryId = EntityIdSchema.parse(req.params?.categoryId);
      const userId = EntityIdSchema.parse(req.userId);

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

  async delete(req: HTTPRequest<null>): Promise<HTTPResponse<null>> {
    try {
      const categoryId = EntityIdSchema.parse(req.params?.categoryId);
      const userId = EntityIdSchema.parse(req.userId);

      await this.categoryService.delete(categoryId, userId);

      return { statusCode: HTTPStatusCode.NO_CONTENT, body: null };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }
}
