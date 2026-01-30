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
  register(registerData: UserRegisterDTO): Promise<UserDocument>;

  findOneByEmail(email: string): Promise<UserDocument | null>;

  findOneById(userId: EntityIdDTO): Promise<UserDocument | null>;

  update(
    userId: EntityIdDTO,
    newData: UserUpdateDTO,
  ): Promise<UserDocument | null>;

  delete(userId: EntityIdDTO): Promise<UserDocument | null>;
}

export interface IUserService {
  register(registerData: UserRegisterDTO): Promise<AuthResponseDTO>;

  login(loginData: UserLoginDTO): Promise<AuthResponseDTO>;

  refreshToken(token: string): Promise<AuthResponseDTO>;

  findOneById(userId: EntityIdDTO): Promise<UserResponseDTO>;

  update(userId: EntityIdDTO, newData: UserUpdateDTO): Promise<UserResponseDTO>;

  delete(userId: EntityIdDTO): Promise<void>;
}

export interface IUserController {
  register(
    req: HTTPRequest<UserRegisterDTO>,
  ): Promise<HTTPResponse<AuthResponseDTO>>;

  login(req: HTTPRequest<UserLoginDTO>): Promise<HTTPResponse<AuthResponseDTO>>;

  refreshToken(req: HTTPRequest<null>): Promise<HTTPResponse<AuthResponseDTO>>;

  findOneById(req: HTTPRequest<null>): Promise<HTTPResponse<UserResponseDTO>>;

  update(
    req: HTTPRequest<UserUpdateDTO>,
  ): Promise<HTTPResponse<UserResponseDTO>>;

  delete(req: HTTPRequest<null>): Promise<HTTPResponse<null>>;
}
