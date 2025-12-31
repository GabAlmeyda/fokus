import mongoose from 'mongoose';
import { UserModel } from '../models/user-model.js';
import { CategoryModel } from '../models/category-model.js';
import { HabitModel } from '../models/habit-model.js';

export async function connectToMongoDB() {
  const MONGO_URI = process.env.MONGO_URI as string;

  try {
    await mongoose.connect(MONGO_URI, { autoIndex: false });
    console.log('\nSuccessfully connected to MongoDB');

    console.log('\nSynchronizing indexes...');
    await UserModel.syncIndexes();
    await CategoryModel.syncIndexes();
    await HabitModel.syncIndexes();
    console.log('Indexes synchronized');
  } catch (err) {
    console.error(
      '[connect-mongo.ts (server)] Error when attempting to connect to MongoDB: ',
      err,
    );
    process.exit(8080);
  }
}
