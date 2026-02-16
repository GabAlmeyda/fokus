import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import type { AuthRequest } from '../types/express.types.js';
import { AuthResponseSchema } from '../types/auth.types.js';
import { userController } from '../config/factory.config.js';
import { removeCookies, setTokens } from '../helpers/controller.helpers.js';
import { authUserRateLimiter } from '../config/rate-limit.config.js';
import { REQUESTS_RATE_LIMITER } from '../config/rate-limit.config.js';
import { HTTPStatusCode } from '@fokus/shared';

const userRoutes = Router({ mergeParams: true });

// Register route
userRoutes.post('/auth/register', async (req, res) => {
  const { body: reqBody } = req;

  const { statusCode, body } = await userController.register({
    body: reqBody,
  });

  const validation = AuthResponseSchema.safeParse(body);
  if (validation.success) {
    setTokens(res, {
      accessToken: validation.data.accessToken,
      refreshToken: validation.data.refreshToken,
    });

    return res.status(statusCode).json(validation.data.user);
  }

  return res.status(statusCode).json(body);
});

// Login route
userRoutes.post('/auth/login', async (req, res) => {
  const { body: reqBody } = req;

  const { statusCode, body } = await userController.login({
    body: reqBody,
  });

  const validation = AuthResponseSchema.safeParse(body);
  if (validation.success) {
    setTokens(res, {
      accessToken: validation.data.accessToken,
      refreshToken: validation.data.refreshToken,
    });

    return res.status(statusCode).json(validation.data.user);
  }

  return res.status(statusCode).json(body);
});

// Refresh route
userRoutes.post('/auth/refresh/me', async (req, res) => {
  const refreshToken = req.cookies.refresh_token;

  const { statusCode, body } = await userController.refreshToken({
    refreshToken,
  });

  const validation = AuthResponseSchema.safeParse(body);
  if (validation.success) {
    setTokens(res, {
      accessToken: validation.data.accessToken,
      refreshToken: validation.data.refreshToken,
    });

    return res.status(statusCode).json(validation.data.user);
  }

  return res.status(statusCode).json(body);
});

// Logout route
userRoutes.post('/auth/logout/me', async (req, res) => {
  const refreshToken = req.cookies.refresh_token;
  const { statusCode, body } = await userController.logout({ refreshToken });
  removeCookies(res);

  return res.status(statusCode).json(body);
});

userRoutes.use(authMiddleware);

// Find by ID route
userRoutes.get(
  '/me',
  authUserRateLimiter(REQUESTS_RATE_LIMITER.get),
  async (req, res) => {
    const { user } = req as AuthRequest;

    const { statusCode, body } = await userController.findOneById({
      userId: user.id,
    });
    return res.status(statusCode).json(body);
  },
);

// Update route
userRoutes.patch(
  '/me',
  authUserRateLimiter(REQUESTS_RATE_LIMITER.patch),
  async (req, res) => {
    const { body: reqBody, user } = req as AuthRequest;

    const { statusCode, body } = await userController.update({
      body: reqBody,
      userId: user.id,
    });
    return res.status(statusCode).json(body);
  },
);

// Delete route
userRoutes.delete(
  '/me',
  authUserRateLimiter(REQUESTS_RATE_LIMITER.delete),
  async (req, res) => {
    const { user } = req as AuthRequest;

    const { statusCode, body } = await userController.delete({
      userId: user.id,
    });
    if (statusCode === HTTPStatusCode.NO_CONTENT) removeCookies(res);

    return res.status(statusCode).json(body);
  },
);

export default userRoutes;
