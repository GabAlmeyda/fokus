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
  const title = Array.isArray(authReq.query.title)
    ? authReq.query.title[0]?.toString()
    : authReq.query.title?.toString();
  const categoryId = Array.isArray(authReq.query.categoryId)
    ? authReq.query.categoryId[0]?.toString()
    : authReq.query.categoryId?.toString();
  const deadlineType = Array.isArray(authReq.query.deadlineType)
    ? authReq.query.deadlineType[0]?.toString()
    : authReq.query.deadlineType?.toString();

  const { statusCode, body } = await goalController.findByFilter({
    query: { title, categoryId, deadlineType },
    userId,
  });
  return res.status(statusCode).json(body);
});

export default goalRoutes;
