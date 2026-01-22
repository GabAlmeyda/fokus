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
import type {
  IUserController,
  IUserService,
} from '../interfaces/user.interfaces.js';
import { formatHTTPErrorResponse } from '../helpers/controller.helpers.js';

export class UserController implements IUserController {
  private readonly userService;
  constructor(userService: IUserService) {
    this.userService = userService;
  }

  async register(
    req: HTTPRequest<UserRegisterDTO>,
  ): Promise<HTTPResponse<AuthResponseDTO>> {
    try {
      const registerData = UserRegisterSchema.parse(req.body);

      const { user, token } = await this.userService.register(registerData);
      return {
        statusCode: 201,
        body: { user, token },
      };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }

  async login(
    req: HTTPRequest<UserLoginDTO>,
  ): Promise<HTTPResponse<AuthResponseDTO>> {
    try {
      const loginData = UserLoginSchema.parse(req.body);

      const { user, token } = await this.userService.login(loginData);
      return {
        statusCode: 200,
        body: { user, token },
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

      const user = await this.userService.findOneById(userId);
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

      const user = await this.userService.update(userId, newData);
      return {
        statusCode: HTTPStatusCode.OK,
        body: user,
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
