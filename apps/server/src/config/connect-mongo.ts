import mongoose from 'mongoose';

export async function connectToMongoDB() {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.error("[connect-mongo] MongoDB URI not defined in '.env' file");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI, { autoIndex: false });

    console.log('\nSuccessfully connected to MongoDB');

    console.log('Created collections:');
    const collections = await mongoose.connection.db?.collections();

    if (collections) {
      collections.map((c) => console.log(`- ${c.collectionName}`));
    }
  } catch (err) {
    console.error('Error when attempting to connect to MongoDB: ', err);
    process.exit(8080);
  }
}
