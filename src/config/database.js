// HoneyCup/src/config/database.js
import { connect } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDatabase = async () => {
  if (process.env.NODE_ENV === "test") {
    console.log("Skipping MongoDB connection in test environment.");
    return;
  }

  const dbUri = process.env.MONGODB_URI; // mongodb://localhost:27017/honeyCup

  try {
    console.log("Connecting to MongoDB at:", dbUri);

    await connect(dbUri, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log("MongoDB connected successfully.");
  } catch (error) {
    // database.js
    console.error("MongoDB connection failed:", error.message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDatabase;
