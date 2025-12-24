import mongoose from 'mongoose';
import { UserModel } from '../models/user-model.js';
import { CategoryModel } from '../models/category-model.js';
import { HabitModel } from '../models/habit-model.js';

export async function connectToMongoDB() {
  const MONGO_URI = process.env.MONGO_URI as string;

  try {
    await mongoose.connect(MONGO_URI, { autoIndex: false });
    console.log('\nSuccessfully connected to MongoDB');

    if (process.env.NODE_ENV === 'dev') {
      console.log('Created collections:');
      const collections = await mongoose.connection.db?.collections();
      if (collections) {
        collections.map((c) => console.log(`- ${c.collectionName}`));
      }

      console.log('\n\nCreated indexes:');

      console.log('- USER INDEXES:');
      await UserModel.syncIndexes();
      const userIndexes = Object.keys(await UserModel.collection.getIndexes());
      userIndexes.forEach((index) => console.log(` * ${index}`));

      console.log('\n- CATEGORY INDEXES:');
      await CategoryModel.syncIndexes();
      const categoryIndexes = Object.keys(
        await CategoryModel.collection.getIndexes(),
      );
      categoryIndexes.forEach((index) => console.log(` * ${index}`));

      console.log('\n- HABITS INDEXES:');
      await HabitModel.syncIndexes();
      const habitIndexes = Object.keys(
        await HabitModel.collection.getIndexes(),
      );
      habitIndexes.forEach((index) => console.log(` * ${index}`));
    }
  } catch (err) {
    console.error(
      '[connect-mongo.ts (server)] Error when attempting to connect to MongoDB: ',
      err,
    );
    process.exit(8080);
  }
}
