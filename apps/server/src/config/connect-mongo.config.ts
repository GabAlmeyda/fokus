import mongoose from 'mongoose';
import { env } from './env.config.js';
import { UserModel } from '../models/user.model.js';
import { CategoryModel } from '../models/category.model.js';
import { HabitModel } from '../models/habit.model.js';
import { GoalModel } from '../models/goal.model.js';
import { ProgressLogModel } from '../models/progress-log.model.js';
import { RefreshTokenModel } from '../models/refresh-token.model.js';

export async function connectToMongoDB() {
  try {
    await mongoose.connect(env.MONGO_URI, { autoIndex: false });
    console.log('\nSuccessfully connected to MongoDB');

    console.log('\nSynchronizing indexes...');
    await UserModel.syncIndexes();
    await CategoryModel.syncIndexes();
    await HabitModel.syncIndexes();
    await GoalModel.syncIndexes();
    await ProgressLogModel.syncIndexes();
    await RefreshTokenModel.syncIndexes();
    console.log('Indexes synchronized');
  } catch (err) {
    console.error(
      '[connect-mongo.ts (server)] Error when attempting to connect to MongoDB: ',
      err,
    );
    process.exit(1);
  }
}
