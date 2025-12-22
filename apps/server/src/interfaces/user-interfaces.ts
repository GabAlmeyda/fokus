import type {
  RegisterUserDTO,
  HTTPRequest,
  HTTPErrorResponse,
  HTTPSuccessResponse,
  ResponseAuthDTO,
  LoginUserDTO,
  ResponseUserDTO,
  UpdateUserDTO,
} from '@fokus/shared';
import type { UserDocument } from '../models/user-model.js';
import type { Types } from 'mongoose';

export interface IUserRepository {
  register(user: RegisterUserDTO): Promise<UserDocument>;

  findOneByEmail(email: string): Promise<UserDocument | null>;

  findOneById(userId: Types.ObjectId): Promise<UserDocument | null>;

  update(
    userId: Types.ObjectId,
    newData: UpdateUserDTO,
  ): Promise<UserDocument | null>;

  delete(userId: Types.ObjectId): Promise<UserDocument | null>;
}

export interface IUserService {
  register(
    user?: RegisterUserDTO,
  ): Promise<{ userDoc: UserDocument; token: string }>;

  login(user?: LoginUserDTO): Promise<{ userDoc: UserDocument; token: string }>;

  findOneById(userId?: string): Promise<UserDocument>;

  update(userId?: string, newData?: UpdateUserDTO): Promise<UserDocument>;

  delete(userId?: string): Promise<UserDocument>;
}

export interface IUserController {
  register(
    req: HTTPRequest<RegisterUserDTO>,
  ): Promise<HTTPSuccessResponse<ResponseAuthDTO> | HTTPErrorResponse>;

  login(
    req: HTTPRequest<LoginUserDTO>,
  ): Promise<HTTPSuccessResponse<ResponseAuthDTO> | HTTPErrorResponse>;

  findOneById(
    req: HTTPRequest<null>,
  ): Promise<HTTPSuccessResponse<ResponseUserDTO> | HTTPErrorResponse>;

  update(
    req: HTTPRequest<UpdateUserDTO>,
  ): Promise<HTTPSuccessResponse<ResponseUserDTO> | HTTPErrorResponse>;

  delete(
    req: HTTPRequest<null>,
  ): Promise<HTTPSuccessResponse<ResponseUserDTO> | HTTPErrorResponse>;
}
