import mongoose from 'mongoose';
import serverConfig from './serverConfig.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(serverConfig.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
