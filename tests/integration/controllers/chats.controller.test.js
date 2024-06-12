// tests/controllers/chats.controller.test.js

import chai from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import chatService from "../../../src/services/chats.service.js";
import chatsController from "../../../src/api/controllers/chats.controller.js";
import Conversation from "../../../src/models/chats.model.js";

chai.use(chaiHttp);
const { expect } = chai;

describe("Chats Controller", () => {
  let mongoServer;
  let conversationId;

  before(async () => {
    // Start in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    // Create a new conversation and store its ID
    const newConversation = await Conversation.create({
      participants: ["user1", "user2"],
      messages: [],
    });
    conversationId = newConversation._id;
  });

  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe("sendMessage", () => {
    it("should send a message and return saved conversation", async () => {
      const req = {
        params: {
          conversationId: conversationId.toString(),
        },
        body: {
          message_id: "message1",
          sender_id: "user1",
          receiver_id: "user2",
          content: "Hello, this is a text message.",
          content_type: "text",
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const expectedResponse = {
        _id: "conversation1",
        participants: ["user1", "user2"],
        messages: [
          {
            message_id: "message1",
            sender_id: "user1",
            receiver_id: "user2",
            content: "Hello, this is a text message.",
            content_type: "text",
          },
        ],
      };
      sinon.stub(chatService, "sendMessage").resolves(expectedResponse);

      await chatsController.sendMessage(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(expectedResponse)).to.be.true;
      chatService.sendMessage.restore();
    });

    it("should handle errors and return status 500 with error message", async () => {
      const req = {
        params: {
          conversationId: conversationId.toString(),
        },
        body: {
          message_id: "message1",
          sender_id: "user1",
          receiver_id: "user2",
          content: "Hello, this is a text message.",
          content_type: "text",
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const errorMessage = "Internal Server Error";
      sinon.stub(chatService, "sendMessage").throws(new Error(errorMessage));

      await chatsController.sendMessage(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: errorMessage })).to.be.true;
      chatService.sendMessage.restore();
    });

    // Add more test cases here
  });

  describe("getMessages", () => {
    it("should return messages of a conversation", async () => {
      const req = {
        params: {
          conversationId: conversationId.toString(),
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const expectedMessages = [
        {
          message_id: "message1",
          sender_id: "user1",
          receiver_id: "user2",
          content: "Hello, this is a text message.",
          content_type: "text",
        },
        {
          message_id: "message2",
          sender_id: "user2",
          receiver_id: "user1",
          content: "Hi, how are you?",
          content_type: "text",
        },
      ];
      sinon
        .stub(chatService, "getMessages")
        .withArgs(conversationId) // Using the conversationId directly
        .resolves(expectedMessages);

      await chatsController.getMessages(req, res);

      expect(res.status.calledWith(200)).to.be.true;
    });

    it("should handle errors and return status 500 with error message", async () => {
      const req = {
        params: {
          conversationId: conversationId.toString(),
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const errorMessage = "Internal Server Error";

      // Restore the original method if it was previously stubbed
      if (chatService.getMessages.restore) {
        chatService.getMessages.restore();
      }

      // Stub the method to throw an error
      sinon.stub(chatService, "getMessages").throws(new Error(errorMessage));

      await chatsController.getMessages(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: errorMessage })).to.be.true;
    });
  });

  describe("editMessage", () => {
    it("should edit a message and return updated conversation", async () => {
      const req = {
        params: {
          conversationId: conversationId.toString(),
          messageId: "message1",
        },
        body: {
          content: "Updated message content.",
          content_type: "text",
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const expectedUpdatedConversation = {
        _id: conversationId,
        messages: [
          {
            message_id: "message1",
            content: "Updated message content.",
            content_type: "text",
          },
        ],
      };
      sinon
        .stub(chatService, "editMessage")
        .resolves(expectedUpdatedConversation);

      await chatsController.editMessage(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(expectedUpdatedConversation)).to.be.true;
      chatService.editMessage.restore();
    });

    it("should handle errors and return status 500 with error message", async () => {
      const req = {
        params: {
          conversationId: conversationId.toString(),
          messageId: "message1",
        },
        body: {
          content: "Updated message content.",
          content_type: "text",
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const errorMessage = "Internal Server Error";
      sinon.stub(chatService, "editMessage").throws(new Error(errorMessage));

      await chatsController.editMessage(req, res);

      // console.log(
      //   "Expected status: 500, Actual status:",
      //   res.status.args[0][0]
      // );
      // console.log(
      //   "Expected message:",
      //   { message: errorMessage },
      //   "Actual message:",
      //   res.json.args[0][0]
      // );

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: errorMessage })).to.be.true;
      chatService.editMessage.restore();
    });

    // Add more test cases here
  });

  describe("deleteMessage", () => {
    it("should delete a message and return updated conversation", async () => {
      const req = {
        params: {
          conversationId: conversationId.toString(),
          messageId: "message1",
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const expectedUpdatedConversation = {
        _id: "conversation1",
        messages: [],
      };
      sinon
        .stub(chatService, "deleteMessage")
        .resolves(expectedUpdatedConversation);

      await chatsController.deleteMessage(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(expectedUpdatedConversation)).to.be.true;
      chatService.deleteMessage.restore();
    });

    it("should handle errors and return status 500 with error message", async () => {
      const req = {
        params: {
          conversationId: conversationId.toString(),
          messageId: "message1",
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const errorMessage = "Internal Server Error";
      sinon.stub(chatService, "deleteMessage").throws(new Error(errorMessage));

      await chatsController.deleteMessage(req, res);

      // console.log(
      //   "Expected status: 500, Actual status:",
      //   res.status.args[0][0]
      // );
      // console.log(
      //   "Expected message:",
      //   { message: errorMessage },
      //   "Actual message:",
      //   res.json.args[0][0]
      // );

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: errorMessage })).to.be.true;
      chatService.deleteMessage.restore();
    });

    // Add more test cases here
  });
  /////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////

  describe("getMessage", () => {
    let stubGetConversation;

    beforeEach(() => {
      stubGetConversation = sinon.stub(chatService, "getConversation");
    });

    afterEach(() => {
      stubGetConversation.restore();
    });

    it("should return a specific message", async () => {
      const req = {
        params: {
          conversationId: conversationId.toString(),
          messageId: "message1",
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const expectedMessage = {
        message_id: "message1",
        content: "Hello, this is a text message.",
        content_type: "text",
      };

      stubGetConversation.withArgs(conversationId.toString()).resolves({
        _id: conversationId.toString(),
        messages: [expectedMessage],
      });

      await chatsController.getMessage(req, res);

      console.log("Response status: ", res.status.args[0][0]);
      console.log("Response message: ", res.json.args[0][0]);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(expectedMessage)).to.be.true;
    });

    it("should handle errors and return status 500 with error message", async () => {
      const req = {
        params: {
          conversationId: conversationId.toString(),
          messageId: "message1",
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const errorMessage = "Internal Server Error";

      stubGetConversation.throws(new Error(errorMessage));

      await chatsController.getMessage(req, res);

      // console.log(
      //   "Expected status: 500, Actual status:",
      //   res.status.args[0][0]
      // );
      // console.log(
      //   "Expected message:",
      //   { message: errorMessage },
      //   "Actual message:",
      //   res.json.args[0][0]
      // );

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: errorMessage })).to.be.true;
    });

    it("should return status 404 if conversation not found", async () => {
      const req = {
        params: {
          conversationId: conversationId.toString(),
          messageId: "message1",
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      stubGetConversation.withArgs("conversation1").resolves(null);

      await chatsController.getMessage(req, res);

      // console.log(
      //   "Expected status: 404, Actual status:",
      //   res.status.args[0][0]
      // );
      // console.log(
      //   "Expected message:",
      //   { message: "Conversation not found" },
      //   "Actual message:",
      //   res.json.args[0][0]
      // );

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: "Conversation not found" })).to.be
        .true;
    });

    it("should return status 404 if conversation not found", async () => {
      const req = {
        params: {
          conversationId: conversationId.toString(),
          messageId: "message1",
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      stubGetConversation.withArgs("conversation1").resolves(null);

      await chatsController.getMessage(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: "Conversation not found" })).to.be
        .true;
    });
  });
});
