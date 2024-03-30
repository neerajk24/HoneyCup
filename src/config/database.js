import { connect } from 'mongoose';

console.log('Connecting to MongoDB at:', process.env.MONGODB_URI);

const connectDatabase = async () => {
    // Determine the connection URI based on the environment
    const dbUri = process.env.MONGODB_URI;

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
