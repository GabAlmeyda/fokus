import type { NextFunction, Request, Response } from 'express';
import type { AuthRequest } from '../types/express-types.js';
import { ServiceError } from '../helpers/service-errors.js';
import jwt from 'jsonwebtoken';
import { type TokenPayloadDTO } from 'packages/shared/dist/index.js';

export default function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const authReq = req as AuthRequest;

  try {
    const token = authReq.cookies.access_token;
    if (!token) {
      throw new ServiceError('UNAUTHORIZED', 'Authentication token missing.');
    }

    const JWT_SECRET = process.env.JWT_SECRET as string;

    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayloadDTO;
    authReq.user = decoded;

    return next();
  } catch (err) {
    if (err instanceof ServiceError) {
      return next(err);
    }

    return next(new ServiceError('FORBIDDEN', 'Invalid or expired session.'));
  }
}
