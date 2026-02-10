import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.config.js';
import type { AuthRequest } from '../types/express.types.js';
import { AppServerError } from '../helpers/errors/app-server.errors.js';
import { type TokenPayloadDTO } from '../types/auth.types.js';
import { UserRepository } from '../repositories/user.repository.js';

const userRepository = new UserRepository();

export default async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const authReq = req as AuthRequest;

  try {
    const token = authReq.cookies?.access_token;
    if (!token) {
      throw new AppServerError('UNAUTHORIZED', 'Authentication token missing.');
    }

    const JWT_SECRET = env.JWT_SECRET;
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayloadDTO;

    const user = await userRepository.findOneById(decoded.id);
    if (!user) {
      throw new AppServerError('UNAUTHORIZED', `User not found.`);
    }

    authReq.user = {
      id: user._id.toString(),
    } as TokenPayloadDTO;

    return next();
  } catch (err) {
    if (err instanceof AppServerError) {
      return next(err);
    }

    return next(new AppServerError('FORBIDDEN', 'Invalid or expired session.'));
  }
}
