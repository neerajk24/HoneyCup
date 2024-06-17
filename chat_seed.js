import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./src/models/user.model.js";
import Conversation from "./src/models/chats.model.js";

async function createUser(username, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.findOneAndUpdate(
    { email }, // Use email as the unique identifier
    {
      username,
      email,
      password: hashedPassword,
      isActive: true,
      authMethods: ["email"],
    },
    { upsert: true, new: true, setDefaultsOnInsert: true } // Create a new user if not found, otherwise update the existing user
  );
  return user;
}

async function seed() {
  await mongoose.connect("mongodb://127.0.0.1:27017/honeyCup", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const user1 = await createUser("user1", "user1@example.com", "password123");
  const user2 = await createUser("user2", "user2@example.com", "password123");

  const messages = [
    {
      message_id: new mongoose.Types.ObjectId().toString(),
      sender_id: user1._id.toString(),
      receiver_id: user2._id.toString(),
      content: "Hello, how are you?",
      content_type: "text",
      content_link: null,
      timestamp: new Date(),
      is_read: false,
      is_appropriate: true,
    },
    {
      message_id: new mongoose.Types.ObjectId().toString(),
      sender_id: user2._id.toString(),
      receiver_id: user1._id.toString(),
      content: "I'm good, thanks!",
      content_type: "text",
      content_link: null,
      timestamp: new Date(),
      is_read: false,
      is_appropriate: true,
    },
    {
      message_id: new mongoose.Types.ObjectId().toString(),
      sender_id: user1._id.toString(),
      receiver_id: user2._id.toString(),
      content: null,
      content_type: "file",
      content_link:
        "https://kavoappstorage.blob.core.windows.net/azure-filearchive/test.jpg",
      timestamp: new Date(),
      is_read: false,
      is_appropriate: true,
    },
  ];

  const conversation = await Conversation.findOneAndUpdate(
    { participants: { $all: [user1._id.toString(), user2._id.toString()] } },
    {
      $setOnInsert: {
        _id: new mongoose.Types.ObjectId(),
        participants: [user1._id.toString(), user2._id.toString()],
      },
      $set: {
        messages,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true } // Create a new conversation if not found, otherwise update the existing one
  );

  console.log("Seed data created successfully!");
  mongoose.connection.close();
}

seed().catch((err) => console.error(err));
