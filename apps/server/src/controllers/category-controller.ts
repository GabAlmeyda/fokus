import {
  type HTTPRequest,
  type CreateCategoryDTO,
  type HTTPSuccessResponse,
  type ResponseCategoryDTO,
  type HTTPErrorResponse,
  HTTPStatusCode,
} from 'packages/shared/dist/index.js';
import type { ICategoryController } from '../interfaces/category-interfaces.js';
import { CategoryService } from '../services/category-service.js';
import { mapCategoryDocToPublicDTO } from '../helpers/mappers.js';
import { ServiceError } from '../helpers/service-errors.js';

export class CategoryController implements ICategoryController {
  private readonly categoryService = new CategoryService();

  async createCategory(
    req?: HTTPRequest<CreateCategoryDTO>,
  ): Promise<HTTPSuccessResponse<ResponseCategoryDTO> | HTTPErrorResponse> {
    try {
      const createdCategoryDoc = await this.categoryService.createCategory(
        req?.body,
      );
      const createdCategory = mapCategoryDocToPublicDTO(createdCategoryDoc);

      return {
        statusCode: HTTPStatusCode.CREATED,
        body: createdCategory,
      };
    } catch (err) {
      if (err instanceof ServiceError) {
        return {
          statusCode: HTTPStatusCode[err.errorType],
          body: {
            message: err.message,
            invalidFields: err.invalidFields,
          },
        };
      }

      return {
        statusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
        body: {
          message: 'An unexpected error occurred.',
          invalidFields: [],
        },
      };
    }
  }
}
