import { sendMessage } from "../../src/services/chat.service.js";
import Message from "../../src/models/message.model.js";
import User from "../../src/models/user.model.js";
import bcrypt from "bcryptjs";
import sinon from "sinon";
import { expect } from "chai";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbUri = process.env.MONGODB_URI;

describe("Chat Service Test case", () => {
  // sendMessage
  let senderId;
  let recipientId;

  before(async function () {
    this.timeout(30000); // Increase timeout for before hook

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(dbUri, {
        // Deprecated options are removed
      });
      console.log("MongoDB connected successfully.");
    }

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

    for (const user of users) {
      user.chattingWith = users
        .filter((u) => !u._id.equals(user._id))
        .map((u) => ({ user: u._id, continueChat: false }));
      await user.save();
    }

    const sender = await User.findOne({ username: "user1" }).select("_id");
    const recipient = await User.findOne({ username: "user2" }).select("_id");

    if (!sender || !recipient) {
      throw new Error("Sender or recipient not found");
    }

    senderId = sender._id;
    recipientId = recipient._id;
  });

  afterEach(() => {
    sinon.restore();
  });

  after(async function () {
    this.timeout(30000); // Increase timeout for after hook
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
