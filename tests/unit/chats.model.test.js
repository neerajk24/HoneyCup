// chats.model.test.js

import mongoose from "mongoose";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { MongoMemoryServer } from "mongodb-memory-server";
import Conversation from "../../src/models/chats.model.js";

const expect = chai.expect;
chai.use(chaiAsPromised);

describe("Conversation Model", () => {
  let mongoServer;

  before(async () => {
    try {
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("MongoDB connected successfully.");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }
  });

  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    console.log("MongoDB disconnected.");
  });

  beforeEach(async () => {
    await Conversation.deleteMany({});
  });

  describe("Creating a conversation", () => {
    it("should create a new conversation", async () => {
      const participants = ["user1", "user2"];
      const conversation = await Conversation.create({ participants });

      expect(conversation).to.be.an("object");
      expect(conversation.participants).to.deep.equal(participants);
      expect(conversation.messages).to.be.an("array").that.is.empty;
    });

    it("should throw error if participants are not provided", async () => {
      await expect(
        Conversation.create({ participants: [] })
      ).to.be.rejectedWith(mongoose.Error.ValidationError);
    });
  });

  describe("Adding a message to a conversation", () => {
    it("should add a message to the conversation", async () => {
      const participants = ["user1", "user2"];
      const conversation = await Conversation.create({ participants });

      const message = {
        message_id: "123456",
        sender_id: "user1",
        receiver_id: "user2",
        content: "Hello!",
        content_type: "text",
      };

      conversation.messages.push(message);
      await conversation.save();

      const updatedConversation = await Conversation.findById(conversation._id);

      expect(updatedConversation.messages).to.have.lengthOf(1);
      expect(updatedConversation.messages[0].message_id).to.equal("123456");
    });

    it("should return 'text' as content type for a text message", async () => {
      const message = {
        message_id: "123456",
        sender_id: "user1",
        receiver_id: "user2",
        content: "Hello!",
        content_type: "text",
      };

      const conversation = await Conversation.create({
        participants: ["user1", "user2"],
        messages: [message],
      });

      expect(conversation.messages[0].content_type).to.equal("text");
    });

    it("should return the file extension as detected content type for a file message", async () => {
      const message = {
        message_id: "789012",
        sender_id: "user2",
        receiver_id: "user1",
        content_type: "file",
        content_link: "https://example.com/image.jpg",
      };

      const conversation = await Conversation.create({
        participants: ["user1", "user2"],
        messages: [message],
      });

      expect(conversation.messages[0].detected_content_type).to.equal(".jpg");
    });

    it("should return 'text' as detected content type if content type is 'file' but content link is not provided", async () => {
      const message = {
        message_id: "345678",
        sender_id: "user1",
        receiver_id: "user2",
        content_type: "file",
      };

      const conversation = await Conversation.create({
        participants: ["user1", "user2"],
        messages: [message],
      });

      expect(conversation.messages[0].detected_content_type).to.equal("text");
    });
  });

  describe("Marking Message as Read", () => {
    it("should mark a message as read", async () => {
      const conversation = await Conversation.create({
        participants: ["user1", "user2"],
        messages: [
          {
            message_id: "123456",
            sender_id: "user2",
            receiver_id: "user1",
            content: "Hello!",
            content_type: "text",
          },
        ],
      });

      const message = conversation.messages[0];
      message.is_read = true;

      await conversation.save();

      const updatedConversation = await Conversation.findById(conversation._id);

      expect(updatedConversation.messages[0].is_read).to.be.true;
    });
  });

  describe("Filtering Messages", () => {
    it("should filter messages based on sender_id", async () => {
      const conversation = await Conversation.create({
        participants: ["user1", "user2"],
        messages: [
          {
            message_id: "123456",
            sender_id: "user2",
            receiver_id: "user1",
            content: "Hello!",
            content_type: "text",
          },
          {
            message_id: "789012",
            sender_id: "user1",
            receiver_id: "user2",
            content: "Hi there!",
            content_type: "text",
          },
        ],
      });

      const user1Messages = conversation.messages.filter(
        (message) => message.sender_id === "user1"
      );

      expect(user1Messages).to.have.lengthOf(1);
      expect(user1Messages[0].content).to.equal("Hi there!");
    });
  });
});
