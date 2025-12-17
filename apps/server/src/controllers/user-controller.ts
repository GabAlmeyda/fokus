import {
  type HTTPRequest,
  type RegisterUserDTO,
  type HTTPSuccessResponse,
  type ResponseUserDTO,
  type HTTPErrorResponse,
  HTTPStatusCode,
} from '@fokus/shared';
import type { IUserController } from '../interfaces/user-interfaces.js';
import { UserService } from '../services/user-service.js';
import { mapUserDocToPublicDTO } from '../helpers/mappers.js';
import { ServiceError } from '../helpers/service-errors.js';

export class UserController implements IUserController {
  private readonly userService = new UserService();

  async registerUser(
    req?: HTTPRequest<RegisterUserDTO>,
  ): Promise<HTTPSuccessResponse<ResponseUserDTO> | HTTPErrorResponse> {
    try {
      const userDoc = await this.userService.registerUser(req?.body);
      const registeredUser = mapUserDocToPublicDTO(userDoc);

      return {
        statusCode: 201,
        body: registeredUser,
      };
    } catch (err) {
      if (err instanceof ServiceError) {
        return {
          statusCode: HTTPStatusCode[err.errorType],
          body: {
            message: err.message,
            ...(err.invalidFields && { invalidFields: err.invalidFields }),
          },
        };
      }

      return {
        statusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
        body: { message: 'An unknown error occurred.' },
      };
    }
  }
}
