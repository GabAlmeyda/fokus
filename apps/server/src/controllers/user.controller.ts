import {
  type HTTPRequest,
  type UserRegisterDTO,
  HTTPStatusCode,
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
  IUserManagerService,
  IUserService,
} from '../interfaces/user.interfaces.js';
import { formatHTTPErrorResponse } from '../helpers/controller.helpers.js';
import { AppServerError } from '../helpers/errors/app-server.errors.js';
import type { AuthResponseDTO } from '../types/auth.types.js';

export class UserController implements IUserController {
  private readonly userService;
  private readonly userManagerService;
  constructor(
    userService: IUserService,
    userManagerService: IUserManagerService,
  ) {
    this.userService = userService;
    this.userManagerService = userManagerService;
  }

  async register(
    req: HTTPRequest<UserRegisterDTO>,
  ): Promise<HTTPResponse<AuthResponseDTO>> {
    try {
      const registerData = UserRegisterSchema.parse(req.body);

      const { auth, accessToken, refreshToken } =
        await this.userService.register(registerData);
      return {
        statusCode: 201,
        body: { auth, accessToken, refreshToken },
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

      const { auth, accessToken, refreshToken } =
        await this.userService.login(loginData);
      return {
        statusCode: 200,
        body: { auth, accessToken, refreshToken },
      };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }

  async refreshToken(
    req: HTTPRequest<null>,
  ): Promise<HTTPResponse<AuthResponseDTO>> {
    try {
      const refToken = req.refreshToken;
      if (!refToken) {
        throw new AppServerError('BAD_REQUEST', 'Refresh token is missing.');
      }

      const { auth, accessToken, refreshToken } =
        await this.userService.refreshToken(refToken);
      return {
        statusCode: HTTPStatusCode.OK,
        body: { auth, accessToken, refreshToken },
      };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }

  async logout(req: HTTPRequest<null>): Promise<HTTPResponse<null>> {
    try {
      const refreshToken = req.refreshToken;
      if (!refreshToken) {
        return { statusCode: HTTPStatusCode.NO_CONTENT, body: null };
      }
      if (typeof refreshToken !== 'string') {
        throw new AppServerError(
          'BAD_REQUEST',
          'Invalid refresh token format.',
        );
      }

      await this.userService.logout(refreshToken);
      return { statusCode: HTTPStatusCode.NO_CONTENT, body: null };
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
      await this.userManagerService.deleteCompletely(userId);

      return { statusCode: HTTPStatusCode.NO_CONTENT, body: null };
    } catch (err) {
      return formatHTTPErrorResponse(err);
    }
  }
}
