import {
  type HTTPRequest,
  type RegisterUserDTO,
  type HTTPSuccessResponse,
  type HTTPErrorResponse,
  HTTPStatusCode,
  type ResponseAuthDTO,
  type LoginUserDTO,
  type ResponseUserDTO,
  type UpdateUserDTO,
} from '@fokus/shared';
import type { IUserController } from '../interfaces/user-interfaces.js';
import { UserService } from '../services/user-service.js';
import { mapUserDocToPublicDTO } from '../helpers/mappers.js';
import { formatHTTPErrorResponse } from '../helpers/controller-helpers.js';

export class UserController implements IUserController {
  private readonly userService = new UserService();

  async registerUser(
    req: HTTPRequest<RegisterUserDTO>,
  ): Promise<HTTPSuccessResponse<ResponseAuthDTO> | HTTPErrorResponse> {
    try {
      const { userDoc: registeredUserDoc, token } =
        await this.userService.registerUser(req.body);
      const registeredUser = mapUserDocToPublicDTO(registeredUserDoc);

      return {
        statusCode: 201,
        body: { user: registeredUser, token },
      };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }

  async loginUser(
    req: HTTPRequest<LoginUserDTO>,
  ): Promise<HTTPSuccessResponse<ResponseAuthDTO> | HTTPErrorResponse> {
    try {
      const { userDoc: loggedUserDoc, token } =
        await this.userService.loginUser(req.body);
      const loggedUser = mapUserDocToPublicDTO(loggedUserDoc);

      return {
        statusCode: 200,
        body: { user: loggedUser, token },
      };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }

  async findUserById(
    req: HTTPRequest<null>,
  ): Promise<HTTPSuccessResponse<ResponseUserDTO> | HTTPErrorResponse> {
    const userId = req?.userId;

    try {
      const userDoc = await this.userService.findUserById(userId);
      const user = mapUserDocToPublicDTO(userDoc);

      return {
        statusCode: HTTPStatusCode.OK,
        body: user,
      };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }

  async updateUser(
    req: HTTPRequest<UpdateUserDTO>,
  ): Promise<HTTPSuccessResponse<ResponseUserDTO> | HTTPErrorResponse> {
    const userId = req?.userId;
    const newData = req.body;

    try {
      const updatedUserDoc = await this.userService.updateUser(userId, newData);
      const updatedUser = mapUserDocToPublicDTO(updatedUserDoc);

      return {
        statusCode: HTTPStatusCode.OK,
        body: updatedUser,
      };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }

  async deleteUser(
    req: HTTPRequest<null>,
  ): Promise<HTTPSuccessResponse<ResponseUserDTO> | HTTPErrorResponse> {
    const userId = req?.userId;

    try {
      const deletedUserDoc = await this.userService.deleteUser(userId);
      const deletedUser = mapUserDocToPublicDTO(deletedUserDoc);

      return {
        statusCode: HTTPStatusCode.OK,
        body: deletedUser,
      };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }
}
