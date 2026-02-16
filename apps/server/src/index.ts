import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.config.js';
import { swaggerDocs } from './config/docs/swagger.docs.js';
import { API_URL } from '@fokus/shared';
import { connectToMongoDB } from './config/connect-mongo.config.js';
import userRoutes from './routes/user.routes.js';
import categoryRoutes from './routes/category.routes.js';
import habitRoutes from './routes/habit.routes.js';
import goalRoutes from './routes/goal.routes.js';
import { defaultRateLimiter } from './config/rate-limit.config.js';
import xsrfProtectionMiddleware from './middlewares/xsrf-protection.middleware.js';
import errorMiddleware from './middlewares/error.middleware.js';

async function main() {
  await connectToMongoDB();

  const app = express();
  app.set('trust proxy', 1);
  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
    }),
  );
  app.use(defaultRateLimiter);
  app.use(express.json());
  app.use(cookieParser());
  app.use('/api-docs', ...swaggerDocs);
  app.use(xsrfProtectionMiddleware);

  app.use('/users', userRoutes);
  app.use('/categories', categoryRoutes);
  app.use('/habits', habitRoutes);
  app.use('/goals', goalRoutes);
  app.use(errorMiddleware);

  app.listen(env.PORT, () => {
    console.log(`\nServer running at \x1b[36m'${API_URL}'\x1b[0m`);
    console.log(`See docs at \x1b[35m'${API_URL}/api-docs'\x1b[0m`);
  });
}

main();
