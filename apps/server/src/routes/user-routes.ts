import { Router } from 'express';
import { UserController } from '../controllers/user-controller.js';
import { validateResponseAuthDTO } from 'packages/shared/dist/index.js';

const userRoutes = Router({ mergeParams: true });
const userController = new UserController();

userRoutes.post('/auth/register', async (req, res) => {
  const registerData = req?.body;

  const response = await userController.registerUser({ body: registerData });
  if (validateResponseAuthDTO(response.body)) {
    res.cookie('access_token', response.body.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 1000 * 60 * 15,
    });
  }

  return res.status(response.statusCode).json(response.body);
});

export default userRoutes;
