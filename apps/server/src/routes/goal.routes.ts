import { Router } from 'express';
import { goalController } from '../config/factory.config.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import type { AuthRequest } from '../types/express.types.js';
import {
  authUserRateLimiter,
  REQUESTS_RATE_LIMITER,
} from '../config/rate-limit.config.js';

const goalRoutes = Router({ mergeParams: true });
goalRoutes.use(authMiddleware);

// Add progress log route
goalRoutes.post(
  '/:goalId/logs',
  authUserRateLimiter(REQUESTS_RATE_LIMITER.post),
  async (req, res) => {
    const { body: reqBody, params, query, user } = req as AuthRequest;

    const { statusCode, body } = await goalController.addProgressLog({
      body: reqBody,
      params,
      query,
      userId: user.id,
    });
    return res.status(statusCode).json(body);
  },
);

// Create route
goalRoutes.post(
  '/',
  authUserRateLimiter(REQUESTS_RATE_LIMITER.post),
  async (req, res) => {
    const { user, body: reqBody } = req as AuthRequest;

    const { statusCode, body } = await goalController.create({
      body: reqBody,
      userId: user.id,
    });
    return res.status(statusCode).json(body);
  },
);

// Find by ID route
goalRoutes.get(
  '/:goalId',
  authUserRateLimiter(REQUESTS_RATE_LIMITER.get),
  async (req, res) => {
    const { user, params } = req as AuthRequest;

    const { statusCode, body } = await goalController.findOneById({
      params,
      userId: user.id,
    });
    return res.status(statusCode).json(body);
  },
);

// Find by filter route
goalRoutes.get(
  '/',
  authUserRateLimiter(REQUESTS_RATE_LIMITER.get),
  async (req, res) => {
    const { user, query } = req as AuthRequest;

    const { statusCode, body } = await goalController.findByFilter({
      query,
      userId: user.id,
    });
    return res.status(statusCode).json(body);
  },
);

// Update route
goalRoutes.patch(
  '/:goalId',
  authUserRateLimiter(REQUESTS_RATE_LIMITER.patch),
  async (req, res) => {
    const { params, body: reqBody, user } = req as AuthRequest;

    const { statusCode, body } = await goalController.update({
      params,
      body: reqBody,
      userId: user.id,
    });
    return res.status(statusCode).json(body);
  },
);

// Remove progress log route
goalRoutes.delete(
  '/:goalId/logs/:progressLogId',
  authUserRateLimiter(REQUESTS_RATE_LIMITER.delete),
  async (req, res) => {
    const { params, user } = req as AuthRequest;

    const { statusCode, body } = await goalController.removeProgressLog({
      params,
      userId: user.id,
    });
    return res.status(statusCode).json(body);
  },
);

// Delete route
goalRoutes.delete(
  '/:goalId',
  authUserRateLimiter(REQUESTS_RATE_LIMITER.delete),
  async (req, res) => {
    const { params, user } = req as AuthRequest;

    const { statusCode, body } = await goalController.delete({
      params,
      userId: user.id,
    });
    return res.status(statusCode).json(body);
  },
);

export default goalRoutes;
