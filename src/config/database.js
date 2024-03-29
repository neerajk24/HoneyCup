
// MongoDB connection URL
// const url = 'mongodb://localhost:27017/mydatabase';


const mongoose = require('mongoose');
console.log('Connecting to MongoDB at:', process.env.MONGODB_URI);

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
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

module.exports = connectDatabase;
