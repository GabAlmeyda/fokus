import dotenv from 'dotenv';
dotenv.config();
import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { API_URL, HTTPStatusCode } from '@fokus/shared';
import { connectToMongoDB } from './config/connect-mongo.js';
import { AppServerError } from './helpers/errors/app-server.errors.js';
import userRoutes from './routes/user.routes.js';
import categoryRoutes from './routes/category.routes.js';
import habitRoutes from './routes/habit.routes.js';
import goalRoutes from './routes/goal.routes.js';

async function main() {
  await connectToMongoDB();

  const PORT = process.env.PORT as string;
  const app = express();

  app.use(express.json());
  app.use(
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
    }),
  );
  app.use(cookieParser());

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

  app.listen(PORT, () => console.log(`\nServer running at '${API_URL}'`));
}

function verifyEnvVariables() {
  const envVariable: string[] = ['NODE_ENV', 'JWT_SECRET', 'MONGO_URI', 'PORT'];
  for (const v of envVariable) {
    if (!process.env[v]) {
      console.error(
        `[index.ts (server)] Variable '${v}' not defined in the '.env' file.`,
      );
      process.exit(1);
    }
  }
}

verifyEnvVariables();
main();
