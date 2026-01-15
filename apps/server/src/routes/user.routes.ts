import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { HTTPStatusCode, AuthResponseSchema } from '@fokus/shared';
import authMiddleware from '../middlewares/auth.middleware.js';
import type { AuthRequest } from '../types/express.types.js';

const userRoutes = Router({ mergeParams: true });
const userController = new UserController();

userRoutes.post('/auth/register', async (req, res) => {
  const { body: reqBody } = req;

  const { statusCode, body } = await userController.register({
    body: reqBody,
  });

  const validation = AuthResponseSchema.safeParse(body);
  if (validation.success) {
    res.cookie('access_token', validation.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 1000 * 60 * 15,
    });
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
    res.cookie('access_token', validation.data.token, {
      httpOnly: true,
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 15,
    });
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
  }

  return res.status(statusCode).json(body);
});

export default userRoutes;
