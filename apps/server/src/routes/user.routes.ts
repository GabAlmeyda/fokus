import { Router } from 'express';
import { HTTPStatusCode, AuthResponseSchema } from '@fokus/shared';
import authMiddleware from '../middlewares/auth.middleware.js';
import type { AuthRequest } from '../types/express.types.js';
import { userController } from '../config/factory.js';
import { setTokens } from '../helpers/controller.helpers.js';

const userRoutes = Router({ mergeParams: true });

userRoutes.post('/auth/register', async (req, res) => {
  const { body: reqBody } = req;

  const { statusCode, body } = await userController.register({
    body: reqBody,
  });

  const validation = AuthResponseSchema.safeParse(body);
  if (validation.success) {
    setTokens(res, {
      accessToken: validation.data.accessToken,
      refreshToken: validation.data.refreshToken,
    });

    res.status(statusCode).json(validation.data.user);
  }

  return res.status(statusCode).json(body);
});

userRoutes.post('/auth/login', async (req, res) => {
  const { body: reqBody } = req;

  const { statusCode, body } = await userController.login({
    body: reqBody,
  });

  const validation = AuthResponseSchema.safeParse(body);
  if (validation.success) {
    setTokens(res, {
      accessToken: validation.data.accessToken,
      refreshToken: validation.data.refreshToken,
    });

    res.status(statusCode).json(validation.data.user);
  }

  return res.status(statusCode).json(body);
});

userRoutes.post('/auth/refresh', async (req, res) => {
  const refreshToken = req.cookies.refresh_token;

  const { statusCode, body } = await userController.refreshToken({
    refreshToken,
  });

  const validation = AuthResponseSchema.safeParse(body);
  if (validation.success) {
    setTokens(res, {
      accessToken: validation.data.accessToken,
      refreshToken: validation.data.refreshToken,
    });

    res.status(statusCode).json(validation.data.user);
  }

  return res.status(statusCode).json(body);
});

userRoutes.get('/', authMiddleware, async (req, res) => {
  const { user } = req as AuthRequest;

  const { statusCode, body } = await userController.findOneById({
    userId: user.id,
  });
  return res.status(statusCode).json(body);
});

userRoutes.patch('/', authMiddleware, async (req, res) => {
  const { body: reqBody, user } = req as AuthRequest;

  const { statusCode, body } = await userController.update({
    body: reqBody,
    userId: user.id,
  });
  return res.status(statusCode).json(body);
});

userRoutes.delete('/', authMiddleware, async (req, res) => {
  const { user } = req as AuthRequest;

  const { statusCode, body } = await userController.delete({
    userId: user.id,
  });
  if (statusCode === HTTPStatusCode.OK) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }

  return res.status(statusCode).json(body);
});

export default userRoutes;
