import {
  type HTTPRequest,
  type RegisterUserDTO,
  type HTTPSuccessResponse,
  type HTTPErrorResponse,
  HTTPStatusCode,
  type ResponseAuthDTO,
  type LoginUserDTO,
  type ResponseUserDTO,
} from '@fokus/shared';
import type { IUserController } from '../interfaces/user-interfaces.js';
import { UserService } from '../services/user-service.js';
import { mapUserDocToPublicDTO } from '../helpers/mappers.js';
import { ServiceError } from '../helpers/service-errors.js';

export class UserController implements IUserController {
  private readonly userService = new UserService();

  async registerUser(
    req?: HTTPRequest<RegisterUserDTO>,
  ): Promise<HTTPSuccessResponse<ResponseAuthDTO> | HTTPErrorResponse> {
    try {
      const { userDoc, token } = await this.userService.registerUser(req?.body);
      const registeredUser = mapUserDocToPublicDTO(userDoc);

      return {
        statusCode: 201,
        body: { user: registeredUser, token },
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

  async loginUser(
    req?: HTTPRequest<LoginUserDTO>,
  ): Promise<HTTPSuccessResponse<ResponseAuthDTO> | HTTPErrorResponse> {
    try {
      const { userDoc, token } = await this.userService.loginUser(req?.body);
      const loggedUser = mapUserDocToPublicDTO(userDoc);

      return {
        statusCode: 200,
        body: { user: loggedUser, token },
      };
    } catch (err) {
      if (err instanceof ServiceError) {
        return {
          statusCode: HTTPStatusCode[err.errorType],
          body: { message: err.message },
          ...(err.invalidFields && { invalidFields: err.invalidFields }),
        };
      }

      return {
        statusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
        body: { message: 'An unknown error ocurred.' },
      };
    }
  }

  async findUserById(
    req?: HTTPRequest<null>,
  ): Promise<HTTPSuccessResponse<ResponseUserDTO> | HTTPErrorResponse> {
    const userId = req?.params?.userId;

    try {
      const userDoc = await this.userService.findUserById(userId);
      const user = mapUserDocToPublicDTO(userDoc);

      return {
        statusCode: HTTPStatusCode.OK,
        body: user,
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
