import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.config.js';
import { swaggerDocs } from './config/docs/swagger.docs.js';
import { API_URL, HTTPStatusCode } from '@fokus/shared';
import { connectToMongoDB } from './config/connect-mongo.config.js';
import { AppServerError } from './helpers/errors/app-server.errors.js';
import userRoutes from './routes/user.routes.js';
import categoryRoutes from './routes/category.routes.js';
import habitRoutes from './routes/habit.routes.js';
import goalRoutes from './routes/goal.routes.js';

async function main() {
  await connectToMongoDB();

  const app = express();
  app.use(express.json());
  app.use(
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use('/api-docs', ...swaggerDocs);

  app.use('/users', userRoutes);
  app.use('/categories', categoryRoutes);
  app.use('/habits', habitRoutes);
  app.use('/goals', goalRoutes);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof AppServerError) {
      return res.status(HTTPStatusCode[err.errorType]).json({
        message: err.message,
        invalidFields: err.invalidFields,
      });
    }

    console.error('[index.ts (server)] Internal error: ', err);
    return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json({
      message: 'An unexpected error occurred.',
      invalidFields: [],
    });
  });

  app.listen(env.PORT, () => {
    console.log(`\nServer running at \x1b[36m'${API_URL}'\x1b[0m`);
    console.log(`See docs at \x1b[35m'${API_URL}/api-docs'\x1b[0m`);
  });
}

main();
