import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';

import { API_URL } from '@fokus/shared';
import { connectToMongoDB } from './config/connect-mongo.js';
import userRoutes from './routes/user-routes.js';
import categoryRoutes from './routes/category-routes.js';

async function main() {
  await connectToMongoDB();

  const PORT = process.env.PORT;
  if (!PORT) {
    console.error("[index(server)] Server port not defined in the '.env' file");
    process.exit(1);
  }

  const app = express();

  app.use(express.json());
  app.use(
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
    }),
  );

  app.use('/users', userRoutes);
  app.use('/categories', categoryRoutes);

  app.listen(PORT, () => console.log(`\nServer running at '${API_URL}'`));
}

main();
