import {
  type HTTPRequest,
  type UserRegisterDTO,
  HTTPStatusCode,
  type AuthResponseDTO,
  type UserLoginDTO,
  type UserResponseDTO,
  type UserUpdateDTO,
  type HTTPResponse,
  UserRegisterSchema,
  UserLoginSchema,
  EntityIdSchema,
  UserUpdateSchema,
} from '@fokus/shared';
import type { IUserController } from '../interfaces/user.interfaces.js';
import { UserService } from '../services/user.service.js';
import { mapUserDocToPublicDTO } from '../helpers/mappers.js';
import { formatHTTPErrorResponse } from '../helpers/controller.helpers.js';

export class UserController implements IUserController {
  private readonly userService = new UserService();

  async register(
    req: HTTPRequest<UserRegisterDTO>,
  ): Promise<HTTPResponse<AuthResponseDTO>> {
    try {
      const user = UserRegisterSchema.parse(req.body);

      const { userDoc: registeredUserDoc, token } =
        await this.userService.register(user);
      const registeredUser = mapUserDocToPublicDTO(registeredUserDoc);

      return {
        statusCode: 201,
        body: { user: registeredUser, token },
      };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }

  async login(
    req: HTTPRequest<UserLoginDTO>,
  ): Promise<HTTPResponse<AuthResponseDTO>> {
    try {
      const user = UserLoginSchema.parse(req.body);

      const { userDoc: loggedUserDoc, token } =
        await this.userService.login(user);
      const loggedUser = mapUserDocToPublicDTO(loggedUserDoc);

      return {
        statusCode: 200,
        body: { user: loggedUser, token },
      };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }

  async findOneById(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<UserResponseDTO>> {
    try {
      const userId = EntityIdSchema.parse(req.userId);

      const userDoc = await this.userService.findOneById(userId);
      const user = mapUserDocToPublicDTO(userDoc);

      return {
        statusCode: HTTPStatusCode.OK,
        body: user,
      };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }

  async update(
    req: HTTPRequest<UserUpdateDTO>,
  ): Promise<HTTPResponse<UserResponseDTO>> {
    try {
      const newData = UserUpdateSchema.parse(req.body);
      const userId = EntityIdSchema.parse(req.userId);

      const updatedUserDoc = await this.userService.update(userId, newData);
      const updatedUser = mapUserDocToPublicDTO(updatedUserDoc);

      return {
        statusCode: HTTPStatusCode.OK,
        body: updatedUser,
      };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }

  async delete(req: HTTPRequest<null>): Promise<HTTPResponse<null>> {
    try {
      const userId = EntityIdSchema.parse(req.userId);
      await this.userService.delete(userId);

      return { statusCode: HTTPStatusCode.NO_CONTENT, body: null };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }
}
