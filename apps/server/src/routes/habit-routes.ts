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
  const userId = authReq.user.id;

  const { statusCode, body } = await habitController.findAll({ userId });
  return res.status(statusCode).json(body);
});

habitRoutes.get('/weekDay', authMiddleware, async (req, res) => {
  const authReq = req as AuthRequest;
  const day = Array.isArray(authReq.query?.day)
    ? authReq.query.day[0]?.toString()
    : authReq.query.day?.toString();
  const userId = authReq.user.id;

  const { statusCode, body } = await habitController.findAllByWeekDay({
    query: { day },
    userId,
  });
  return res.status(statusCode).json(body);
});

habitRoutes.get('/titles/:title', authMiddleware, async (req, res) => {
  const authReq = req as AuthRequest;
  const title = authReq.params?.title;
  const userId = authReq.user.id;

  const { statusCode, body } = await habitController.findOneByTitle({
    params: { title },
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
