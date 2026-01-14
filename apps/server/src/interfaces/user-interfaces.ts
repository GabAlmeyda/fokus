import type {
  RegisterUserDTO,
  HTTPRequest,
  ResponseAuthDTO,
  LoginUserDTO,
  ResponseUserDTO,
  UpdateUserDTO,
  HTTPResponse,
  EntityIdDTO,
} from '@fokus/shared';
import type { UserDocument } from '../models/user-model.js';

export interface IUserRepository {
  register(user: RegisterUserDTO): Promise<UserDocument>;

  findOneByEmail(email: string): Promise<UserDocument | null>;

  findOneById(userId: EntityIdDTO): Promise<UserDocument | null>;

  update(
    userId: EntityIdDTO,
    newData: UpdateUserDTO,
  ): Promise<UserDocument | null>;

  delete(userId: EntityIdDTO): Promise<UserDocument | null>;
}

export interface IUserService {
  register(
    user: RegisterUserDTO,
  ): Promise<{ userDoc: UserDocument; token: string }>;

  login(user: LoginUserDTO): Promise<{ userDoc: UserDocument; token: string }>;

  findOneById(userId: EntityIdDTO): Promise<UserDocument>;

  update(userId: EntityIdDTO, newData: UpdateUserDTO): Promise<UserDocument>;

  delete(userId: EntityIdDTO): Promise<void>;
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

  delete(req: HTTPRequest<null>): Promise<HTTPResponse<null>>;
}
