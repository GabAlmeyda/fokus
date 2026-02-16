import type { NextFunction, Request, Response } from 'express';
import { AppServerError } from '../helpers/errors/app-server.errors.js';

export default function xsrfProtectionMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  const publicPaths = ['/users/auth/login', '/users/auth/register'];
  if (safeMethods.includes(req.method)) return next();
  if (publicPaths.includes(req.path)) return next();

  const xsrfCookie = req.cookies['XSRF-TOKEN'];
  const xsrfHeader = req.headers['x-xsrf-token'];
  if (!xsrfCookie || !xsrfHeader || xsrfCookie !== xsrfHeader) {
    return next(new AppServerError('FORBIDDEN', 'CSRF validation failed.'));
  }

  return next();
}
