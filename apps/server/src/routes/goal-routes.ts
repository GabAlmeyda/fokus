import { Router } from 'express';
import { GoalController } from '../controllers/goal-controller.js';
import authMiddleware from '../middlewares/auth-middleware.js';
import type { AuthRequest } from '../types/express-types.js';

const goalController = new GoalController();
const goalRoutes = Router({ mergeParams: true });

goalRoutes.post('/', authMiddleware, async (req, res) => {
  const authReq = req as AuthRequest;
  const userId = authReq.user.id;

  const { statusCode, body } = await goalController.create({
    body: { ...authReq.body },
    userId,
  });
  return res.status(statusCode).json(body);
});

goalRoutes.get('/titles/:title', authMiddleware, async (req, res) => {
  const authReq = req as AuthRequest;
  const title = authReq.params?.title;
  const userId = authReq.user.id;

  const { statusCode, body } = await goalController.findOneByTitle({
    params: { title },
    userId,
  });
  return res.status(statusCode).json(body);
});

goalRoutes.get('/:goalId', authMiddleware, async (req, res) => {
  const authReq = req as AuthRequest;
  const goalId = authReq.params?.goalId;
  const userId = authReq.user.id;

  const { statusCode, body } = await goalController.findOneById({
    params: { goalId },
    userId,
  });
  return res.status(statusCode).json(body);
});

goalRoutes.get('/', authMiddleware, async (req, res) => {
  const authReq = req as AuthRequest;
  const userId = authReq.user.id;

  const { statusCode, body } = await goalController.findAll({ userId });
  return res.status(statusCode).json(body);
});

export default goalRoutes;
