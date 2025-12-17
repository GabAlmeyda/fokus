import { Router } from 'express';
import { UserController } from '../controllers/user-controller.js';

const userRoutes = Router({ mergeParams: true });
const userController = new UserController();

userRoutes.post('/auth/register', async (req, res) => {
  const registerData = req?.body;

  const result = await userController.registerUser({ body: registerData });
  return res.status(result.statusCode).json(result.body);
});

export default userRoutes;
