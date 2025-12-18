import type {
  RegisterUserDTO,
  HTTPRequest,
  HTTPErrorResponse,
  HTTPSuccessResponse,
  ResponseAuthDTO,
  LoginUserDTO,
  ResponseUserDTO,
} from '@fokus/shared';
import type { UserDocument } from '../models/user-model.js';
import type { Types } from 'mongoose';

export interface IUserRepository {
  registerUser(user: RegisterUserDTO): Promise<UserDocument>;

  findUserByEmail(email: string): Promise<UserDocument | null>;

  findUserById(userId: Types.ObjectId): Promise<UserDocument | null>;
}

export interface IUserService {
  registerUser(
    user?: RegisterUserDTO,
  ): Promise<{ userDoc: UserDocument; token: string }>;

  loginUser(
    user?: LoginUserDTO,
  ): Promise<{ userDoc: UserDocument; token: string }>;

  findUserById(userId?: string): Promise<UserDocument>;
}

export interface IUserController {
  registerUser(
    req?: HTTPRequest<RegisterUserDTO>,
  ): Promise<HTTPSuccessResponse<ResponseAuthDTO> | HTTPErrorResponse>;

  loginUser(
    req?: HTTPRequest<LoginUserDTO>,
  ): Promise<HTTPSuccessResponse<ResponseAuthDTO> | HTTPErrorResponse>;

  findUserById(
    req?: HTTPRequest<null>,
  ): Promise<HTTPSuccessResponse<ResponseUserDTO> | HTTPErrorResponse>;
}
