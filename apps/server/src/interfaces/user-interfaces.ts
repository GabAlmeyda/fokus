import type {
  RegisterUserDTO,
  ResponseUserDTO,
  HTTPRequest,
  HTTPErrorResponse,
  HTTPSuccessResponse,
} from '@fokus/shared';
import type { UserDocument } from '../models/user-model.js';

export interface IUserRepository {
  registerUser(user: RegisterUserDTO): Promise<UserDocument>;
}

export interface IUserService {
  registerUser(user?: RegisterUserDTO): Promise<UserDocument>;
}

export interface IUserController {
  registerUser(
    req?: HTTPRequest<RegisterUserDTO>,
  ): Promise<HTTPSuccessResponse<ResponseUserDTO> | HTTPErrorResponse>;
}
