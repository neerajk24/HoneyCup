// HoneyCup/src/config/database.js
import { connect } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

console.log('Connecting to MongoDB at:', process.env.MONGODB_URI);

const connectDatabase = async () => {
    // Determine the connection URI based on the environment
    const dbUri = process.env.MONGODB_URI;   // mongodb://localhost:27017/honeyCup

  try {
    await connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDatabase;
