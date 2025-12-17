import type {
  RegisterUserDTO,
  HTTPRequest,
  HTTPErrorResponse,
  HTTPSuccessResponse,
  ResponseAuthDTO,
} from '@fokus/shared';
import type { UserDocument } from '../models/user-model.js';

export interface IUserRepository {
  registerUser(user: RegisterUserDTO): Promise<UserDocument>;
}

export interface IUserService {
  registerUser(
    user?: RegisterUserDTO,
  ): Promise<{ userDoc: UserDocument; token: string }>;
}

export interface IUserController {
  registerUser(
    req?: HTTPRequest<RegisterUserDTO>,
  ): Promise<HTTPSuccessResponse<ResponseAuthDTO> | HTTPErrorResponse>;
}
