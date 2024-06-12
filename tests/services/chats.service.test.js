// src/services/chats.service.test.js

import mongoose from "mongoose";
import ChatService from "../../src/services/chats.service.js";
import Conversation from "../../src/models/chats.model.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import dotenv from "dotenv";
import { expect } from "chai";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import { dirname, resolve } from "path";

dotenv.config();

let mongoServer;
const user1Id = new mongoose.Types.ObjectId();
const user2Id = new mongoose.Types.ObjectId();
let conversationId;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

before(async () => {
  // Ensure MongoDB connection is established only once
  if (!mongoose.connection.readyState) {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  }
});

after(async () => {
  // Disconnect from MongoDB and stop the server after tests
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

beforeEach(async () => {
  // Ensure MongoDB is connected before each test
  if (mongoose.connection.readyState !== 1) {
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  }

  // Clear collections and seed database
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
  await seedDatabase();
});

const seedDatabase = async () => {
  await mongoose.connection.db.collection("users").insertMany([
    { _id: user1Id, username: "user1" },
    { _id: user2Id, username: "user2" },
  ]);

  const conversation = await Conversation.create({
    participants: [user1Id.toString(), user2Id.toString()],
    messages: [],
  });

  conversationId = conversation._id;
};

describe("Chats Service", () => {
  it("should send a text message", async () => {
    const message = {
      message_id: new mongoose.Types.ObjectId().toString(),
      sender_id: user1Id.toString(),
      receiver_id: user2Id.toString(),
      content: "Hello, this is a text message.",
      content_type: "text",
    };
    const conversation = await ChatService.sendMessage(conversationId, message);
    expect(conversation.messages.length).to.equal(1);
    expect(conversation.messages[0].content).to.equal(message.content);
    global.textMessageId = conversation.messages[0].message_id; // Save message ID for deletion
  });

  it("should send a .txt file", async () => {
    const testTextFilePath = path.resolve(__dirname, "test_text_file.txt");
    const message = {
      message_id: new mongoose.Types.ObjectId().toString(),
      sender_id: user1Id.toString(),
      receiver_id: user2Id.toString(),
      content_type: "file",
      content_link: testTextFilePath,
    };
    const conversation = await ChatService.sendMessage(conversationId, message);
    expect(conversation.messages.length).to.equal(1);
    expect(conversation.messages[0].content_link).to.include(
      "test_text_file.txt"
    ); // Verify URL
  });

  it("should send a .jpg file", async () => {
    const testJpgFilePath = path.resolve(__dirname, "img_jpg.jpg");
    const message = {
      message_id: new mongoose.Types.ObjectId().toString(),
      sender_id: user1Id.toString(),
      receiver_id: user2Id.toString(),
      content_type: "file",
      content_link: testJpgFilePath,
    };
    const conversation = await ChatService.sendMessage(conversationId, message);
    expect(conversation.messages.length).to.equal(1);
    expect(conversation.messages[0].content_link).to.include("img_jpg.jpg"); // Verify URL
  });

  it("should send a .png file", async () => {
    const testPngFilePath = path.resolve(__dirname, "img_png.png");
    const message = {
      message_id: new mongoose.Types.ObjectId().toString(),
      sender_id: user1Id.toString(),
      receiver_id: user2Id.toString(),
      content_type: "file",
      content_link: testPngFilePath,
    };
    const conversation = await ChatService.sendMessage(conversationId, message);
    expect(conversation.messages.length).to.equal(1);
    expect(conversation.messages[0].content_link).to.include("img_png.png"); // Verify URL
  });

  it("should get all messages", async () => {
    let conversation = await Conversation.findById(conversationId);
    const messages = [
      {
        message_id: new mongoose.Types.ObjectId().toString(),
        sender_id: user1Id.toString(),
        receiver_id: user2Id.toString(),
        content: "Hello, this is a text message.",
        content_type: "text",
      },
      {
        message_id: new mongoose.Types.ObjectId().toString(),
        sender_id: user1Id.toString(),
        receiver_id: user2Id.toString(),
        content_type: "file",
        content_link: "./test_text_file.txt",
      },
    ];
    conversation.messages = messages;
    await conversation.save();

    const fetchedMessages = await ChatService.getMessages(conversationId);
    expect(fetchedMessages.length).to.equal(messages.length);
  });

  it("should edit a message", async () => {
    const conversation = await Conversation.findById(conversationId);
    const message = {
      message_id: new mongoose.Types.ObjectId().toString(),
      sender_id: user1Id.toString(),
      receiver_id: user2Id.toString(),
      content: "Hello, this is a text message.",
      content_type: "text",
    };
    conversation.messages.push(message);
    await conversation.save();

    const newMessage = {
      content: "Edited message content",
      content_type: "text",
    };
    const updatedConversation = await ChatService.editMessage(
      conversationId,
      message.message_id, // Use message_id directly
      newMessage
    );
    expect(updatedConversation.messages[0].content).to.equal(
      newMessage.content
    );
  });

  it("should delete a message", async () => {
    const conversation = await Conversation.findById(conversationId);
    const message = {
      message_id: new mongoose.Types.ObjectId().toString(),
      sender_id: user1Id.toString(),
      receiver_id: user2Id.toString(),
      content: "Hello, this is a text message.",
      content_type: "text",
    };
    conversation.messages.push(message);
    await conversation.save();

    const updatedConversation = await ChatService.deleteMessage(
      conversationId,
      conversation.messages[0].message_id
    );
    expect(updatedConversation.messages.length).to.equal(0);
  });
});
