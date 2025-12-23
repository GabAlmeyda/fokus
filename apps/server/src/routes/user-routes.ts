import { Router } from 'express';
import { UserController } from '../controllers/user-controller.js';
import { ResponseAuthSchema } from 'packages/shared/dist/index.js';
import authMiddleware from '../middlewares/auth-middleware.js';
import type { AuthRequest } from '../types/express-types.js';

const userRoutes = Router({ mergeParams: true });
const userController = new UserController();

userRoutes.post('/auth/register', async (req, res) => {
  const registerData = req?.body;

  const { statusCode, body } = await userController.register({
    body: registerData,
  });
  const validation = ResponseAuthSchema.safeParse(body);
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
  const loginData = req?.body;

  const { statusCode, body } = await userController.login({
    body: loginData,
  });
  const validation = ResponseAuthSchema.safeParse(body);
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
  const authReq = req as AuthRequest;
  const userId = authReq.user.id;

  const { statusCode, body } = await userController.findOneById({
    userId,
  });

  return res.status(statusCode).json(body);
});

userRoutes.patch('/', authMiddleware, async (req, res) => {
  const authReq = req as AuthRequest;
  const userId = authReq.user.id;
  const newData = req?.body;

  const { statusCode, body } = await userController.update({
    body: newData,
    userId,
  });

  return res.status(statusCode).json(body);
});

userRoutes.delete('/', authMiddleware, async (req, res) => {
  const authReq = req as AuthRequest;
  const userId = authReq.user.id;

  const { statusCode, body } = await userController.delete({
    userId,
  });

  return res.status(statusCode).json(body);
});

export default userRoutes;
