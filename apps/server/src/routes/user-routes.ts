import { Router } from 'express';
import { UserController } from '../controllers/user-controller.js';
import { ResponseAuthSchema } from 'packages/shared/dist/index.js';

const userRoutes = Router({ mergeParams: true });
const userController = new UserController();

userRoutes.post('/auth/register', async (req, res) => {
  const registerData = req?.body;

  const { statusCode, body } = await userController.registerUser({
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

  const { statusCode, body } = await userController.loginUser({
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

userRoutes.get('/:userId', async (req, res) => {
  const userId = req?.params?.userId;
  const { statusCode, body } = await userController.findUserById({
    params: { userId },
  });

  return res.status(statusCode).json(body);
});

userRoutes.patch('/:userId', async (req, res) => {
  const userId = req?.params?.userId;
  const newData = req?.body;

  const { statusCode, body } = await userController.updateUser({
    params: { userId },
    body: newData,
  });

  return res.status(statusCode).json(body);
});

userRoutes.delete('/:userId', async (req, res) => {
  const userId = req?.params?.userId;
  const { statusCode, body } = await userController.deleteUser({
    params: { userId },
  });

  return res.status(statusCode).json(body);
});

export default userRoutes;
