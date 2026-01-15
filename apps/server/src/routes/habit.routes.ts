import { Router } from 'express';
import { HabitController } from '../controllers/habit.controller.js';
import type { AuthRequest } from '../types/express.types.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const habitController = new HabitController();
const habitRoutes = Router({ mergeParams: true });

habitRoutes.post('/', authMiddleware, async (req, res) => {
  const { body: reqBody, user } = req as AuthRequest;

  const { statusCode, body } = await habitController.create({
    body: reqBody,
    userId: user.id,
  });
  return res.status(statusCode).json(body);
});

habitRoutes.get('/', authMiddleware, async (req, res) => {
  const { query, user } = req as AuthRequest;

  const { statusCode, body } = await habitController.findByFilter({
    query,
    userId: user.id,
  });
  return res.status(statusCode).json(body);
});

habitRoutes.get('/:habitId', authMiddleware, async (req, res) => {
  const { params, user } = req as AuthRequest;

  const { statusCode, body } = await habitController.findOneById({
    params,
    userId: user.id,
  });
  return res.status(statusCode).json(body);
});

habitRoutes.patch('/:habitId', authMiddleware, async (req, res) => {
  const { params, body: reqBody, user } = req as AuthRequest;

  const { statusCode, body } = await habitController.update({
    params,
    body: reqBody,
    userId: user.id,
  });
  return res.status(statusCode).json(body);
});

habitRoutes.delete('/:habitId', authMiddleware, async (req, res) => {
  const { params, user } = req as AuthRequest;

  const { statusCode, body } = await habitController.delete({
    params,
    userId: user.id,
  });
  return res.status(statusCode).json(body);
});

export default habitRoutes;
