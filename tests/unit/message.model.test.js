/**
 * @fileOverview Unit tests for the Message Model.
 * @module message.model.test
 */

import mongoose from "mongoose";
import { use, expect as _expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import Message from "../../src/models/message.model.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../src/models/user.model.js";
import connectDatabase from "../../src/config/database.js";

use(chaiAsPromised);
const expect = _expect;

/**
 * Describes the unit tests for the Message Model.
 */
describe("Message Model", () => {
  let mongoServer;

  /**
   * Sets up the test environment by connecting to the database.
   */
  before(async () => {
    try {
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log("MongoDB connected successfully.");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }
  });

  /**
   * Disconnect from MongoDB and stop the server after tests.
   */
  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    console.log("MongoDB disconnected.");
  });

  beforeEach(async () => {
    // Clear any existing collections or data before each test
  });

  /**
   * 1. Tests if a message can be saved successfully.
   */
  it("should save a message", async function () {
    this.timeout(60000);

    const senderId = new mongoose.Types.ObjectId();
    const receiverId = new mongoose.Types.ObjectId();
    const messageData = {
      sender: senderId,
      receiver: receiverId,
      content: "Test message content",
    };

    const message = new Message(messageData);
    const savedMessage = await message.save();

    expect(savedMessage).to.exist;
    expect(savedMessage.sender).to.eql(senderId);
    expect(savedMessage.receiver).to.eql(receiverId);
    expect(savedMessage.content).to.equal(messageData.content);
    expect(savedMessage.timestamp).to.be.a("Date");
    expect(savedMessage.isImage).to.be.false; // New field check
    expect(savedMessage.seenBy).to.be.an("array").that.is.empty; // New field check
  });

  /**
   * 2. Tests if a message can be retrieved by ID.
   */
  it("should retrieve a message by ID", async function () {
    this.timeout(60000);

    const senderId = new mongoose.Types.ObjectId();
    const receiverId = new mongoose.Types.ObjectId();
    const messageData = {
      sender: senderId,
      receiver: receiverId,
      content: "Test message content",
    };

    const message = new Message(messageData);
    await message.save();

    const retrievedMessage = await Message.findById(message._id);

    expect(retrievedMessage).to.exist;
    expect(retrievedMessage.sender).to.eql(senderId);
    expect(retrievedMessage.receiver).to.eql(receiverId);
    expect(retrievedMessage.content).to.equal(messageData.content);
  });

  /**
   * 3. Tests if a message can be updated.
   */
  it("should update a message", async function () {
    this.timeout(60000);

    const senderId = new mongoose.Types.ObjectId();
    const receiverId = new mongoose.Types.ObjectId();
    const messageData = {
      sender: senderId,
      receiver: receiverId,
      content: "Test message content",
    };

    const message = new Message(messageData);
    await message.save();

    const newContent = "Updated message content";
    message.content = newContent;
    await message.save();

    const updatedMessage = await Message.findById(message._id);

    expect(updatedMessage).to.exist;
    expect(updatedMessage.content).to.equal(newContent);
  });

  /**
   * 4. Tests if a message can be deleted.
   */
  it("should delete a message", async function () {
    this.timeout(60000);

    const senderId = new mongoose.Types.ObjectId();
    const receiverId = new mongoose.Types.ObjectId();
    const messageData = {
      sender: senderId,
      receiver: receiverId,
      content: "Test message content",
    };

    const message = new Message(messageData);
    await message.save();

    await Message.findByIdAndDelete(message._id);

    const deletedMessage = await Message.findById(message._id);
    expect(deletedMessage).to.not.exist;
  });

  /**
   * 5. Tests if multiple messages can be deleted at once.
   */
  it("should delete multiple messages", async function () {
    this.timeout(60000);
    // Create multiple messages
    const messageData1 = {
      sender: new mongoose.Types.ObjectId(),
      receiver: new mongoose.Types.ObjectId(),
      content: "Message 1",
    };
    const messageData2 = {
      sender: new mongoose.Types.ObjectId(),
      receiver: new mongoose.Types.ObjectId(),
      content: "Message 2",
    };
    const messageData3 = {
      sender: new mongoose.Types.ObjectId(),
      receiver: new mongoose.Types.ObjectId(),
      content: "Message 3",
    };

    await Message.create([messageData1, messageData2, messageData3]);

    // Delete multiple messages
    const deleteQuery = { content: { $regex: /^Message/ } };
    await Message.deleteMany(deleteQuery);

    // Verify deletion
    const deletedMessages = await Message.find(deleteQuery);
    expect(deletedMessages).to.have.lengthOf(0);
  });

  /**
   * 6. Tests if multiple messages can be retrieved at once.
   */
  it("should retrieve multiple messages", async function () {
    this.timeout(60000);
    // Create multiple messages
    const messageData1 = {
      sender: new mongoose.Types.ObjectId(),
      receiver: new mongoose.Types.ObjectId(),
      content: "Message 1",
    };
    const messageData2 = {
      sender: new mongoose.Types.ObjectId(),
      receiver: new mongoose.Types.ObjectId(),
      content: "Message 2",
    };

    await Message.create([messageData1, messageData2]);

    // Retrieve multiple messages
    const retrievedMessages = await Message.find();

    // Verify retrieval
    expect(retrievedMessages).to.have.lengthOf.at.least(2);
  });

  /**
   * 7. Tests if required fields (sender, receiver, content) are enforced.
   */
  it("should require sender, receiver, and content fields", async function () {
    this.timeout(60000);
    // Create a message object without required fields
    const messageWithoutFields = new Message({});

    // Attempt to save the message without required fields
    let error;

    try {
      // Saving the message without required fields should throw a validation error
      await messageWithoutFields.save();
    } catch (err) {
      error = err;
    }

    // Assert that the error is a validation error and it contains specific error messages for missing fields
    expect(error).to.exist;
    expect(error).to.be.an.instanceOf(mongoose.Error.ValidationError);
    expect(error.errors.sender).to.exist;
    expect(error.errors.sender.kind).to.equal("required");
    expect(error.errors.receiver).to.exist;
    expect(error.errors.receiver.kind).to.equal("required");
    expect(error.errors.content).to.exist;
    expect(error.errors.content.kind).to.equal("required");
  });

  /**
   * 8. Tests if the isImage field defaults to false when a new message is created.
   */
  it("should default the isImage field to false when creating a new message", async function () {
    this.timeout(60000);

    const senderId = new mongoose.Types.ObjectId();
    const receiverId = new mongoose.Types.ObjectId();
    const messageData = {
      sender: senderId,
      receiver: receiverId,
      content: "Test message content",
    };

    const message = new Message(messageData);
    await message.save();

    expect(message.isImage).to.be.false;
  });

  /**
   * 9. Tests if the seenBy field is initially empty when a new message is created.
   */
  it("should have an empty seenBy field when creating a new message", async function () {
    this.timeout(60000);

    const senderId = new mongoose.Types.ObjectId();
    const receiverId = new mongoose.Types.ObjectId();
    const messageData = {
      sender: senderId,
      receiver: receiverId,
      content: "Test message content",
    };

    const message = new Message(messageData);
    await message.save();

    expect(message.seenBy).to.be.an("array").that.is.empty;
  });

  /**
   * 10. Tests if the isImage field is set to true when creating a message with an image.
   */
  it("should set the isImage field to true when creating a message with an image", async function () {
    this.timeout(60000);

    const senderId = new mongoose.Types.ObjectId();
    const receiverId = new mongoose.Types.ObjectId();
    const messageData = {
      sender: senderId,
      receiver: receiverId,
      content: "Image file path here",
      isImage: true, // Assuming this is how you indicate an image message
    };

    const message = new Message(messageData);
    await message.save();

    expect(message.isImage).to.be.true;
  });

  // 11. Tests if the seenBy field is updated correctly when a user views the message
  it("should update the seenBy field when a user views the message", async function () {
    this.timeout(60000);

    const senderId = new mongoose.Types.ObjectId();
    const receiverId = new mongoose.Types.ObjectId();
    const viewerId = new mongoose.Types.ObjectId(); // User viewing the message
    const messageData = {
      sender: senderId,
      receiver: receiverId,
      content: "Test message content",
    };

    const message = new Message(messageData);
    await message.save();

    // Simulate the user viewing the message
    message.seenBy.push(viewerId);
    await message.save();

    const updatedMessage = await Message.findById(message._id);

    expect(updatedMessage.seenBy).to.include(viewerId);
  });
});
