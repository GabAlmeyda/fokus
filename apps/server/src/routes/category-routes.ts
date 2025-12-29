import { Router } from 'express';
import { CategoryController } from '../controllers/category-controller.js';
import authMiddleware from '../middlewares/auth-middleware.js';
import type { AuthRequest } from '../types/express-types.js';

const categoryController = new CategoryController();
const categoryRoutes = Router({ mergeParams: true });

categoryRoutes.post('/', authMiddleware, async (req, res) => {
  const authReq = req as AuthRequest;
  const category = authReq.body;
  const userId = authReq.user.id;

  const { statusCode, body } = await categoryController.create({
    body: category,
    userId,
  });

  return res.status(statusCode).json(body);
});

categoryRoutes.get('/names/:name', authMiddleware, async (req, res) => {
  const authReq = req as AuthRequest;
  const userId = authReq.user.id;
  const name = authReq.params?.name;

  const { statusCode, body } = await categoryController.findOneByUserAndName({
    params: { name },
    userId,
  });

  return res.status(statusCode).json(body);
});

categoryRoutes.get('/users', authMiddleware, async (req, res) => {
  const authReq = req as AuthRequest;
  const userId = authReq.user.id;

  const { statusCode, body } = await categoryController.findAllByUser({
    userId,
  });

  return res.status(statusCode).json(body);
});

categoryRoutes.get('/:categoryId', authMiddleware, async (req, res) => {
  const authReq = req as AuthRequest;
  const userId = authReq.user.id;
  const categoryId = authReq.params?.categoryId;

  const { statusCode, body } = await categoryController.findOneByIdAndUser({
    params: { categoryId },
    userId,
  });

  return res.status(statusCode).json(body);
});

categoryRoutes.patch('/:categoryId', authMiddleware, async (req, res) => {
  const authReq = req as AuthRequest;
  const newData = authReq.body;
  const categoryId = authReq.params?.categoryId;
  const userId = authReq.user.id;

  const { statusCode, body } = await categoryController.update({
    body: newData,
    params: { categoryId },
    userId,
  });

  return res.status(statusCode).json(body);
});

categoryRoutes.delete('/:categoryId', authMiddleware, async (req, res) => {
  const authReq = req as AuthRequest;
  const categoryId = authReq.params?.categoryId;
  const userId = authReq.user.id;

  const { statusCode, body } = await categoryController.delete({
    params: { categoryId },
    userId,
  });

  return res.status(statusCode).json(body);
});

export default categoryRoutes;
