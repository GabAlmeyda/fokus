import type {
  RegisterUserDTO,
  HTTPRequest,
  HTTPErrorResponse,
  HTTPSuccessResponse,
  ResponseAuthDTO,
  LoginUserDTO,
} from '@fokus/shared';
import type { UserDocument } from '../models/user-model.js';

export interface IUserRepository {
  registerUser(user: RegisterUserDTO): Promise<UserDocument>;

  findByEmail(email: string): Promise<UserDocument | null>;
}

export interface IUserService {
  registerUser(
    user?: RegisterUserDTO,
  ): Promise<{ userDoc: UserDocument; token: string }>;

  loginUser(
    user?: LoginUserDTO,
  ): Promise<{ userDoc: UserDocument; token: string }>;
}

export interface IUserController {
  registerUser(
    req?: HTTPRequest<RegisterUserDTO>,
  ): Promise<HTTPSuccessResponse<ResponseAuthDTO> | HTTPErrorResponse>;

  loginUser(
    req?: HTTPRequest<LoginUserDTO>,
  ): Promise<HTTPSuccessResponse<ResponseAuthDTO> | HTTPErrorResponse>;
}
