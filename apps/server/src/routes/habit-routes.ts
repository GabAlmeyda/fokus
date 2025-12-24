import { Router } from 'express';
import { HabitController } from '../controllers/habit-controller.js';
import type { AuthRequest } from '../types/express-types.js';
import authMiddleware from '../middlewares/auth-middleware.js';

const habitController = new HabitController();
const habitRoutes = Router({ mergeParams: true });

habitRoutes.post('/', authMiddleware, async (req, res) => {
  const authReq = req as AuthRequest;
  const userId = authReq.user.id;

  const { statusCode, body } = await habitController.create({
    body: req.body,
    userId,
  });

  return res.status(statusCode).json(body);
});

export default habitRoutes;
