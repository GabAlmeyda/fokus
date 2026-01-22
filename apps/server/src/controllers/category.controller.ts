import {
  type HTTPRequest,
  type CategoryCreateDTO,
  type CategoryResponseDTO,
  HTTPStatusCode,
  type CategoryUpdateDTO,
  type HTTPResponse,
  CategoryCreateSchema,
  EntityIdSchema,
  CategoryUpdateSchema,
  CategoryFilterSchema,
} from '@fokus/shared';
import type {
  ICategoryController,
  ICategoryService,
} from '../interfaces/category.interfaces.js';
import { formatHTTPErrorResponse } from '../helpers/controller.helpers.js';

export class CategoryController implements ICategoryController {
  private readonly categoryService;
  constructor(categoryService: ICategoryService) {
    this.categoryService = categoryService;
  }

  async create(
    req: HTTPRequest<Omit<CategoryCreateDTO, 'userId'>>,
  ): Promise<HTTPResponse<CategoryResponseDTO>> {
    try {
      const newData = CategoryCreateSchema.parse({
        ...req.body,
        userId: req.userId,
      });

      const category = await this.categoryService.create(newData);
      return {
        statusCode: HTTPStatusCode.CREATED,
        body: category,
      };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }

  async findOneById(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<CategoryResponseDTO>> {
    try {
      const categoryId = EntityIdSchema.parse(req.params?.categoryId);
      const userId = EntityIdSchema.parse(req.userId);

      const category = await this.categoryService.findOneById(
        categoryId,
        userId,
      );
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
  ): Promise<HTTPResponse<CategoryResponseDTO[]>> {
    try {
      const filter = CategoryFilterSchema.parse({
        name: req.query?.name,
      });
      const userId = EntityIdSchema.parse(req.userId);

      const categories = await this.categoryService.findByFilter(
        filter,
        userId,
      );
      return { statusCode: HTTPStatusCode.OK, body: categories };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }

  async update(
    req: HTTPRequest<CategoryUpdateDTO>,
  ): Promise<HTTPResponse<CategoryResponseDTO>> {
    try {
      const newData = CategoryUpdateSchema.parse(req.body);
      const categoryId = EntityIdSchema.parse(req.params?.categoryId);
      const userId = EntityIdSchema.parse(req.userId);

      const category = await this.categoryService.update(
        newData,
        categoryId,
        userId,
      );
      return { statusCode: HTTPStatusCode.OK, body: category };
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
