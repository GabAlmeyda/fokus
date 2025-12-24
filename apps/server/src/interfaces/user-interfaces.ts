import type {
  RegisterUserDTO,
  HTTPRequest,
  ResponseAuthDTO,
  LoginUserDTO,
  ResponseUserDTO,
  UpdateUserDTO,
  HTTPResponse,
} from '@fokus/shared';
import type { UserDocument } from '../models/user-model.js';

export interface IUserRepository {
  register(user: RegisterUserDTO): Promise<UserDocument>;

  findOneByEmail(email: string): Promise<UserDocument | null>;

  findOneById(userId: string): Promise<UserDocument | null>;

  update(userId: string, newData: UpdateUserDTO): Promise<UserDocument | null>;

  delete(userId: string): Promise<UserDocument | null>;
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
  ): Promise<HTTPResponse<ResponseAuthDTO>>;

  login(req: HTTPRequest<LoginUserDTO>): Promise<HTTPResponse<ResponseAuthDTO>>;

  findOneById(req: HTTPRequest<null>): Promise<HTTPResponse<ResponseUserDTO>>;

  update(
    req: HTTPRequest<UpdateUserDTO>,
  ): Promise<HTTPResponse<ResponseUserDTO>>;

  delete(req: HTTPRequest<null>): Promise<HTTPResponse<ResponseUserDTO>>;
}
