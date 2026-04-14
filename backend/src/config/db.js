import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is missing in environment variables.');
  }

  if (mongoUri.includes('cluster0.xxxxx.mongodb.net')) {
    throw new Error(
      'MONGODB_URI uses placeholder host cluster0.xxxxx.mongodb.net. Replace it with your real Atlas cluster host from Connect > Drivers.'
    );
  }

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log('MongoDB connected');
};
