import { Router } from 'express';
import { categoryController } from '../config/factory.config.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import type { AuthRequest } from '../types/express.types.js';

const categoryRoutes = Router({ mergeParams: true });

categoryRoutes.post('/', authMiddleware, async (req, res) => {
  const { body: reqBody, user } = req as AuthRequest;

  const { statusCode, body } = await categoryController.create({
    body: reqBody,
    userId: user.id,
  });
  return res.status(statusCode).json(body);
});

categoryRoutes.get('/:categoryId', authMiddleware, async (req, res) => {
  const { params, user } = req as AuthRequest;

  const { statusCode, body } = await categoryController.findOneById({
    params,
    userId: user.id,
  });
  return res.status(statusCode).json(body);
});

categoryRoutes.get('/', authMiddleware, async (req, res) => {
  const { query, user } = req as AuthRequest;

  const { statusCode, body } = await categoryController.findByFilter({
    query,
    userId: user.id,
  });
  return res.status(statusCode).json(body);
});

categoryRoutes.patch('/:categoryId', authMiddleware, async (req, res) => {
  const { params, body: reqBody, user } = req as AuthRequest;

  const { statusCode, body } = await categoryController.update({
    body: reqBody,
    params,
    userId: user.id,
  });
  return res.status(statusCode).json(body);
});

categoryRoutes.delete('/:categoryId', authMiddleware, async (req, res) => {
  const { params, user } = req as AuthRequest;

  const { statusCode, body } = await categoryController.delete({
    params,
    userId: user.id,
  });
  return res.status(statusCode).json(body);
});

export default categoryRoutes;
