import { Router } from 'express';

import { ProgressLogController } from '../controllers/progress-log.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import type { AuthRequest } from '../types/express.types.js';

const progressLogController = new ProgressLogController();
const progressLogRoutes = Router({ mergeParams: true });

progressLogRoutes.post('/', authMiddleware, async (req, res) => {
  const { body: reqBody, user } = req as AuthRequest;

  const { statusCode, body } = await progressLogController.create({
    body: reqBody,
    userId: user.id,
  });

  return res.status(statusCode).json(body);
});

export default progressLogRoutes;
