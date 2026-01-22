import { Router } from 'express';
import { goalController } from '../config/factory.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import type { AuthRequest } from '../types/express.types.js';

const goalRoutes = Router({ mergeParams: true });

goalRoutes.post('/', authMiddleware, async (req, res) => {
  const { user, body: reqBody } = req as AuthRequest;

  const { statusCode, body } = await goalController.create({
    body: reqBody,
    userId: user.id,
  });
  return res.status(statusCode).json(body);
});

goalRoutes.get('/:goalId', authMiddleware, async (req, res) => {
  const { user, params } = req as AuthRequest;

  const { statusCode, body } = await goalController.findOneById({
    params,
    userId: user.id,
  });
  return res.status(statusCode).json(body);
});

goalRoutes.get('/', authMiddleware, async (req, res) => {
  const { user, query } = req as AuthRequest;

  const { statusCode, body } = await goalController.findByFilter({
    query,
    userId: user.id,
  });
  return res.status(statusCode).json(body);
});

goalRoutes.patch('/:goalId', authMiddleware, async (req, res) => {
  const { params, body: reqBody, user } = req as AuthRequest;

  const { statusCode, body } = await goalController.update({
    params,
    body: reqBody,
    userId: user.id,
  });
  return res.status(statusCode).json(body);
});

goalRoutes.delete('/:goalId', authMiddleware, async (req, res) => {
  const { params, user } = req as AuthRequest;

  const { statusCode, body } = await goalController.delete({
    params,
    userId: user.id,
  });
  return res.status(statusCode).json(body);
});

export default goalRoutes;
