import { Router } from 'express';
import { CategoryController } from '../controllers/category-controller.js';

const categoryController = new CategoryController();
const categoryRoutes = Router({ mergeParams: true });

categoryRoutes.post('/', async (req, res) => {
  const { statusCode, body } = await categoryController.createCategory({
    body: req?.body,
  });

  return res.status(statusCode).json(body);
});

export default categoryRoutes;
