import { Router } from 'express';
import { habitController } from '../config/factory.config.js';
import type { AuthRequest } from '../types/express.types.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import {
  authUserRateLimiter,
  REQUESTS_RATE_LIMITER,
} from '../config/rate-limit.config.js';

const habitRoutes = Router({ mergeParams: true });
habitRoutes.use(authMiddleware);

// Create route
habitRoutes.post(
  '/',
  authUserRateLimiter(REQUESTS_RATE_LIMITER.post),
  async (req, res) => {
    const { body: reqBody, user } = req as AuthRequest;

    const { statusCode, body } = await habitController.create({
      body: reqBody,
      userId: user.id,
    });
    return res.status(statusCode).json(body);
  },
);

// Find by ID route
habitRoutes.get(
  '/:habitId',
  authUserRateLimiter(REQUESTS_RATE_LIMITER.get),
  async (req, res) => {
    const { params, user } = req as AuthRequest;

    const { statusCode, body } = await habitController.findOneById({
      params,
      userId: user.id,
    });
    return res.status(statusCode).json(body);
  },
);

// Find by filter route
habitRoutes.get(
  '/',
  authUserRateLimiter(REQUESTS_RATE_LIMITER.get),
  async (req, res) => {
    const { query, user } = req as AuthRequest;

    const { statusCode, body } = await habitController.findByFilter({
      query,
      userId: user.id,
    });
    return res.status(statusCode).json(body);
  },
);

// Check route
habitRoutes.post(
  '/:habitId/check',
  authUserRateLimiter(REQUESTS_RATE_LIMITER.post),
  async (req, res) => {
    const { params, query, user } = req as AuthRequest;

    const { statusCode, body } = await habitController.check({
      params,
      query,
      userId: user.id,
    });
    return res.status(statusCode).json(body);
  },
);

// Uncheck route
habitRoutes.delete(
  '/:habitId/uncheck',
  authUserRateLimiter(REQUESTS_RATE_LIMITER.delete),
  async (req, res) => {
    const { params, query, user } = req as AuthRequest;

    const { statusCode, body } = await habitController.uncheck({
      params,
      query,
      userId: user.id,
    });
    return res.status(statusCode).json(body);
  },
);

// Update route
habitRoutes.patch(
  '/:habitId',
  authUserRateLimiter(REQUESTS_RATE_LIMITER.patch),
  async (req, res) => {
    const { params, body: reqBody, user } = req as AuthRequest;

    const { statusCode, body } = await habitController.update({
      params,
      body: reqBody,
      userId: user.id,
    });
    return res.status(statusCode).json(body);
  },
);

// Delete route
habitRoutes.delete(
  '/:habitId',
  authUserRateLimiter(REQUESTS_RATE_LIMITER.delete),
  async (req, res) => {
    const { params, user } = req as AuthRequest;

    const { statusCode, body } = await habitController.delete({
      params,
      userId: user.id,
    });
    return res.status(statusCode).json(body);
  },
);

export default habitRoutes;
