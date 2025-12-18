import { Router } from 'express';
import { UserController } from '../controllers/user-controller.js';
import { isResponseAuthDTO } from '@fokus/shared';

const userRoutes = Router({ mergeParams: true });
const userController = new UserController();

userRoutes.post('/auth/register', async (req, res) => {
  const registerData = req?.body;

  const response = await userController.registerUser({ body: registerData });
  if (isResponseAuthDTO(response.body)) {
    res.cookie('access_token', response.body.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 1000 * 60 * 15,
    });
  }

  return res.status(response.statusCode).json(response.body);
});

userRoutes.post('/auth/login', async (req, res) => {
  const loginData = req?.body;

  const response = await userController.loginUser({ body: loginData });
  if (isResponseAuthDTO(response.body)) {
    res.cookie('access_token', response.body.token, {
      httpOnly: true,
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 15,
    });
  } 

  return res.status(response.statusCode).json(response.body);
});

userRoutes.get('/:userId', async (req, res) => {
  const userId = req?.params?.userId;
  const response = await userController.findUserById({ params: { userId } });

  return res.status(response.statusCode).json(response.body);
});

export default userRoutes;
