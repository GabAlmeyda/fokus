import type { Request } from 'express';
import type { TokenPayloadDTO } from '@fokus/shared';

export interface AuthRequest extends Request {
  user: TokenPayloadDTO;
}
