import { Router } from 'express';
import { goalController } from '../config/factory.config.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import type { AuthRequest } from '../types/express.types.js';

const goalRoutes = Router({ mergeParams: true });

// Create route
goalRoutes.post('/', authMiddleware, async (req, res) => {
  const { user, body: reqBody } = req as AuthRequest;

  const { statusCode, body } = await goalController.create({
    body: reqBody,
    userId: user.id,
  });
  return res.status(statusCode).json(body);
});

// Find by ID route
goalRoutes.get('/:goalId', authMiddleware, async (req, res) => {
  const { user, params } = req as AuthRequest;

  const { statusCode, body } = await goalController.findOneById({
    params,
    userId: user.id,
  });
  return res.status(statusCode).json(body);
});

// Find by filter route
goalRoutes.get('/', authMiddleware, async (req, res) => {
  const { user, query } = req as AuthRequest;

  const { statusCode, body } = await goalController.findByFilter({
    query,
    userId: user.id,
  });
  return res.status(statusCode).json(body);
});

// Add progress entry route
goalRoutes.patch('/:goalId/log', authMiddleware, async (req, res) => {
  const { body: reqBody, params, query, user } = req as AuthRequest;

  const { statusCode, body } = await goalController.addProgressEntry({
    body: reqBody,
    params,
    query,
    userId: user.id,
  });
  return res.status(statusCode).json(body);
});

// Update route
goalRoutes.patch('/:goalId', authMiddleware, async (req, res) => {
  const { params, body: reqBody, user } = req as AuthRequest;

  const { statusCode, body } = await goalController.update({
    params,
    body: reqBody,
    userId: user.id,
  });
  return res.status(statusCode).json(body);
});

// Delete route
goalRoutes.delete('/:goalId', authMiddleware, async (req, res) => {
  const { params, user } = req as AuthRequest;

  const { statusCode, body } = await goalController.delete({
    params,
    userId: user.id,
  });
  return res.status(statusCode).json(body);
});

export default goalRoutes;
