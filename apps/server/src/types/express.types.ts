import type { Request } from 'express';
import type { TokenPayloadDTO } from '../types/auth.types.js';

export interface AuthRequest extends Request {
  user: TokenPayloadDTO;
}
