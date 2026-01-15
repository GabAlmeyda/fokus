import type {
  UserRegisterDTO,
  HTTPRequest,
  AuthResponseDTO,
  UserLoginDTO,
  UserResponseDTO,
  UserUpdateDTO,
  HTTPResponse,
  EntityIdDTO,
} from '@fokus/shared';
import type { UserDocument } from '../models/user.model.js';

export interface IUserRepository {
  register(user: UserRegisterDTO): Promise<UserDocument>;

  findOneByEmail(email: string): Promise<UserDocument | null>;

  findOneById(userId: EntityIdDTO): Promise<UserDocument | null>;

  update(
    userId: EntityIdDTO,
    newData: UserUpdateDTO,
  ): Promise<UserDocument | null>;

  delete(userId: EntityIdDTO): Promise<UserDocument | null>;
}

export interface IUserService {
  register(
    user: UserRegisterDTO,
  ): Promise<{ userDoc: UserDocument; token: string }>;

  login(user: UserLoginDTO): Promise<{ userDoc: UserDocument; token: string }>;

  findOneById(userId: EntityIdDTO): Promise<UserDocument>;

  update(userId: EntityIdDTO, newData: UserUpdateDTO): Promise<UserDocument>;

  delete(userId: EntityIdDTO): Promise<void>;
}

export interface IUserController {
  register(
    req: HTTPRequest<UserRegisterDTO>,
  ): Promise<HTTPResponse<AuthResponseDTO>>;

  login(req: HTTPRequest<UserLoginDTO>): Promise<HTTPResponse<AuthResponseDTO>>;

  findOneById(req: HTTPRequest<null>): Promise<HTTPResponse<UserResponseDTO>>;

  update(
    req: HTTPRequest<UserUpdateDTO>,
  ): Promise<HTTPResponse<UserResponseDTO>>;

  delete(req: HTTPRequest<null>): Promise<HTTPResponse<null>>;
}
