// tests/services/chat.service.test.js

import { expect } from "chai";
import sinon from "sinon";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt"; // Import bcrypt
import User from "../../src/models/user.model.js";
import Message from "../../src/models/message.model.js";
import { sendMessage } from "../../src/services/chat.service.js";

dotenv.config();

const dbUri = process.env.MONGODB_URI;

describe("Chat Service Test case", () => {
  let senderId;
  let recipientId;

  before(async () => {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    // Clear users collection before inserting test data
    await User.deleteMany({});

    const userData = [
      {
        username: "user1",
        email: "user1@example.com",
        password: await bcrypt.hash("password1", 12),
      },
      {
        username: "user2",
        email: "user2@example.com",
        password: await bcrypt.hash("password2", 12),
      },
    ];

    const users = await User.insertMany(userData);
    senderId = users[0]._id;
    recipientId = users[1]._id;
  });

  beforeEach(async () => {
    console.log("MongoDB connection state:", mongoose.connection.readyState);
    if (mongoose.connection.readyState !== 1) {
      console.log("Connecting to MongoDB...");
      await mongoose.connect(dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("MongoDB connected!");
    }
  });

  afterEach(() => {
    sinon.restore();
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  it("should send a message when sender and recipient exist", async () => {
    const content = "Hello! From test message from chat.service.text.js";

    // Stub the User.findById method to resolve with mock user objects
    sinon
      .stub(User, "findById")
      .withArgs(senderId)
      .resolves({ _id: senderId })
      .withArgs(recipientId)
      .resolves({ _id: recipientId });

    const savedMessage = new Message({
      sender: senderId,
      receiver: recipientId,
      content,
    });
    sinon.stub(savedMessage, "save").resolves(savedMessage);

    const message = await sendMessage(senderId, recipientId, content);

    expect(message).to.have.property("content", content);
    expect(message).to.have.property("sender", senderId);
    expect(message).to.have.property("receiver", recipientId); // Check receiver property
  });

  it("should throw an error if sender or recipient not found", async () => {
    // Stub the User.findById method to resolve with null, simulating user not found
    sinon.stub(User, "findById").resolves(null);

    try {
      await sendMessage(senderId, recipientId, "Hello!");
    } catch (error) {
      expect(error).to.be.an("error");
      expect(error.message).to.equal(
        "Error sending message: Sender or recipient not found"
      );
    }
  });
});
