import {
  type HTTPRequest,
  type CreateCategoryDTO,
  type HTTPSuccessResponse,
  type ResponseCategoryDTO,
  type HTTPErrorResponse,
  HTTPStatusCode,
} from '@fokus/shared';
import type { ICategoryController } from '../interfaces/category-interfaces.js';
import { CategoryService } from '../services/category-service.js';
import { mapCategoryDocToPublicDTO } from '../helpers/mappers.js';
import { formatHTTPErrorResponse } from '../helpers/controller-helpers.js';

export class CategoryController implements ICategoryController {
  private readonly categoryService = new CategoryService();

  async create(
    req: HTTPRequest<CreateCategoryDTO>,
  ): Promise<HTTPSuccessResponse<ResponseCategoryDTO> | HTTPErrorResponse> {
    try {
      const createdCategoryDoc = await this.categoryService.create(req.body);
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
  ): Promise<HTTPSuccessResponse<ResponseCategoryDTO> | HTTPErrorResponse> {
    try {
      const categoryId = req.params?.categoryId;
      const userId = req.userId;

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
  ): Promise<HTTPSuccessResponse<ResponseCategoryDTO> | HTTPErrorResponse> {
    try {
      const userId = req.userId;
      const name = req.params?.name;

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
}
