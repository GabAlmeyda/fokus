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

habitRoutes.get('/', authMiddleware, async (req, res) => {
  const authReq = req as AuthRequest;
  const title = Array.isArray(req.query.title)
    ? req.query.title[0]?.toString()
    : req.query.title?.toString();
  const weekDay = Array.isArray(req.query?.weekDay)
    ? req.query.weekDay[0]?.toString()
    : req.query.weekDay?.toString();
  const userId = authReq.user.id;

  const { statusCode, body } = await habitController.findByFilter({
    query: { title, weekDay },
    userId,
  });
  return res.status(statusCode).json(body);
});

habitRoutes.get('/:habitId', authMiddleware, async (req, res) => {
  const authReq = req as AuthRequest;
  const habitId = authReq.params?.habitId;
  const userId = authReq.user.id;

  const { statusCode, body } = await habitController.findOneById({
    params: { habitId },
    userId,
  });
  return res.status(statusCode).json(body);
});

habitRoutes.patch('/:habitId', authMiddleware, async (req, res) => {
  const authReq = req as AuthRequest;
  const habitId = authReq.params?.habitId;
  const newData = authReq.body;
  const userId = authReq.user.id;

  const { statusCode, body } = await habitController.update({
    params: { habitId },
    body: newData,
    userId,
  });
  return res.status(statusCode).json(body);
});

habitRoutes.delete('/:habitId', authMiddleware, async (req, res) => {
  const authReq = req as AuthRequest;
  const habitId = authReq.params?.habitId;
  const userId = authReq.user.id;

  const { statusCode, body } = await habitController.delete({
    params: { habitId },
    userId,
  });
  return res.status(statusCode).json(body);
});

export default habitRoutes;
