import {
  type HTTPRequest,
  type RegisterUserDTO,
  HTTPStatusCode,
  type ResponseAuthDTO,
  type LoginUserDTO,
  type ResponseUserDTO,
  type UpdateUserDTO,
  type HTTPResponse,
  RegisterUserSchema,
  LoginUserSchema,
  MongoIdSchema,
  UpdateUserSchema,
} from '@fokus/shared';
import type { IUserController } from '../interfaces/user-interfaces.js';
import { UserService } from '../services/user-service.js';
import { mapUserDocToPublicDTO } from '../helpers/mappers.js';
import { formatHTTPErrorResponse } from '../helpers/controller-helpers.js';

export class UserController implements IUserController {
  private readonly userService = new UserService();

  async register(
    req: HTTPRequest<RegisterUserDTO>,
  ): Promise<HTTPResponse<ResponseAuthDTO>> {
    try {
      const user = RegisterUserSchema.parse(req.body);

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
    req: HTTPRequest<LoginUserDTO>,
  ): Promise<HTTPResponse<ResponseAuthDTO>> {
    try {
      const user = LoginUserSchema.parse(req.body);

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
  ): Promise<HTTPResponse<ResponseUserDTO>> {
    try {
      const userId = MongoIdSchema.parse(req.userId);

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
    req: HTTPRequest<UpdateUserDTO>,
  ): Promise<HTTPResponse<ResponseUserDTO>> {
    try {
      const newData = UpdateUserSchema.parse(req.body);
      const userId = MongoIdSchema.parse(req.userId);

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

  async delete(req: HTTPRequest<null>): Promise<HTTPResponse<ResponseUserDTO>> {
    try {
      const userId = MongoIdSchema.parse(req.userId);

      const deletedUserDoc = await this.userService.delete(userId);
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
