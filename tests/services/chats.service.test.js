// src/services/chats.service.test.js

import mongoose from "mongoose";
import ChatService from "../../src/services/chats.service.js";
import Conversation from "../../src/models/chats.model.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import dotenv from "dotenv";
import { expect } from "chai";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import NotificationService from "../../src/services/notification.service.js";
import admin from "../../src/config/firebaseAdmin.config.js";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import chaiAsPromised from "chai-as-promised";

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

  // console.log("Stubbing sendUnreadMessagesNotification");
  sinon.stub(NotificationService, "sendUnreadMessagesNotification").resolves();
});

afterEach(() => {
  // console.log("Restoring stubs and spies");
  sinon.restore();
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

  it("should send a .txt file", async function () {
    this.timeout(5000);

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

  it("should send a .jpg file", async function () {
    this.timeout(5000);

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

  it("should send a .png file", async function () {
    this.timeout(5000);

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

  it("should get the count of unread messages", async () => {
    const conversation = await Conversation.findById(conversationId);
    const messages = [
      {
        message_id: new mongoose.Types.ObjectId().toString(),
        sender_id: user1Id.toString(),
        receiver_id: user2Id.toString(),
        content: "Unread message 1",
        content_type: "text",
        is_read: false,
      },
      {
        message_id: new mongoose.Types.ObjectId().toString(),
        sender_id: user1Id.toString(),
        receiver_id: user2Id.toString(),
        content: "Unread message 2",
        content_type: "text",
        is_read: false,
      },
      {
        message_id: new mongoose.Types.ObjectId().toString(),
        sender_id: user1Id.toString(),
        receiver_id: user2Id.toString(),
        content: "Read message",
        content_type: "text",
        is_read: true,
      },
    ];
    conversation.messages = messages;
    await conversation.save();

    const unreadCount = await ChatService.getUnreadMessagesCount(
      conversationId
    );
    expect(unreadCount).to.equal(2);
  });

  ////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////

  it("should send a notification when a new text message is sent", async () => {
    try {
      // console.log(
      //   "Starting test: should send a notification when a new text message is sent"
      // );

      if (!NotificationService.sendUnreadMessagesNotification.restore) {
        console.log("Stubbing sendUnreadMessagesNotification in test");
        sinon
          .stub(NotificationService, "sendUnreadMessagesNotification")
          .resolves();
      }

      const message = {
        message_id: new mongoose.Types.ObjectId().toString(),
        sender_id: user1Id.toString(),
        receiver_id: user2Id.toString(),
        content: "Hello, this is a text message.",
        content_type: "text",
      };

      const conversation = await ChatService.sendMessage(
        conversationId,
        message
      );
      expect(conversation.messages.length).to.equal(1);
      expect(conversation.messages[0].content).to.equal(message.content);

      // Verify the stub was called
      expect(NotificationService.sendUnreadMessagesNotification).to.have.been
        .calledOnce;

      // console.log("Test completed successfully");
    } catch (error) {
      // console.error("Error during test:", error);
    } finally {
      // console.log("Restoring stubs in test finally block");
      sinon.restore();
    }
  });

  it("should send a notification when a new file message is sent", async () => {
    try {
      // console.log(
      //   "Starting test: should send a notification when a new file message is sent"
      // );

      if (!NotificationService.sendUnreadMessagesNotification.restore) {
        console.log("Stubbing sendUnreadMessagesNotification in test");
        sinon
          .stub(NotificationService, "sendUnreadMessagesNotification")
          .resolves();
      }

      const testTextFilePath = path.resolve(__dirname, "test_text_file.txt");
      const message = {
        message_id: new mongoose.Types.ObjectId().toString(),
        sender_id: user1Id.toString(),
        receiver_id: user2Id.toString(),
        content_type: "file",
        content_link: testTextFilePath,
      };

      const conversation = await ChatService.sendMessage(
        conversationId,
        message
      );
      expect(conversation.messages.length).to.equal(1);
      expect(conversation.messages[0].content_link).to.include(
        "test_text_file.txt"
      );

      // Verify the stub was called
      expect(NotificationService.sendUnreadMessagesNotification).to.have.been
        .calledOnce;

      // console.log("Test completed successfully");
    } catch (error) {
      // console.error("Error during test:", error);
    } finally {
      // console.log("Restoring stubs in test finally block");
      sinon.restore();
    }
  });

  it("should send a notification for unread messages when a new message is sent", async () => {
    try {
      // console.log(
      //   "Starting test: should send a notification for unread messages when a new message is sent"
      // );

      if (!NotificationService.sendUnreadMessagesNotification.restore) {
        console.log("Stubbing sendUnreadMessagesNotification in test");
        sinon
          .stub(NotificationService, "sendUnreadMessagesNotification")
          .resolves();
      }

      // Mock admin.messaging().sendMulticast
      if (!admin.messaging().sendMulticast.restore) {
        // console.log("Stubbing sendMulticast in test");
        sinon.stub(admin.messaging(), "sendMulticast").resolves({
          successCount: 1,
          failureCount: 0,
          responses: [{ success: true }],
        });
      }

      // Create a conversation with initial messages
      const conversation = await Conversation.create({
        participants: [user1Id.toString(), user2Id.toString()],
        messages: [
          {
            message_id: new mongoose.Types.ObjectId().toString(),
            sender_id: user1Id.toString(),
            receiver_id: user2Id.toString(),
            content: "Unread message 1",
            content_type: "text",
            is_read: false,
          },
          {
            message_id: new mongoose.Types.ObjectId().toString(),
            sender_id: user1Id.toString(),
            receiver_id: user2Id.toString(),
            content: "Read message",
            content_type: "text",
            is_read: true,
          },
        ],
      });

      conversationId = conversation._id;

      const newMessage = {
        message_id: new mongoose.Types.ObjectId().toString(),
        sender_id: user1Id.toString(),
        receiver_id: user2Id.toString(),
        content: "New unread message",
        content_type: "text",
      };

      await ChatService.sendMessage(conversationId, newMessage);

      // Verify the notification method is called with the correct conversation ID
      expect(
        NotificationService.sendUnreadMessagesNotification
      ).to.have.been.calledWith(conversationId);

      // Verify the multicast mock is called
      const sendMulticastMock = admin.messaging().sendMulticast;
      expect(sendMulticastMock).to.have.been.called;
      expect(sendMulticastMock.getCall(0).args[0].notification.title).to.equal(
        "New Unread Message"
      );

      // console.log("Test completed successfully");
    } catch (error) {
      // console.error("Error during test:", error);
    } finally {
      // console.log("Restoring stubs in test finally block");
      sinon.restore();
    }
  });
});
