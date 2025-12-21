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

categoryRoutes.get('/:categoryId', async (req, res) => {
  const categoryId = req?.params?.categoryId;
  const { statusCode, body } = await categoryController.findCategoryById({
    params: { categoryId },
  });

  return res.status(statusCode).json(body);
});

export default categoryRoutes;
