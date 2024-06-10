// src/api/controllers/chats.controller.test.js
import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import chatRouter from "../routes/chats.router.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import Conversation from "../../models/chats.model.js";

const app = express();
app.use(express.json());
app.use("/api/chat", chatRouter);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
  await seedDatabase();
});

const seedDatabase = async () => {
  await Conversation.create({
    _id: "conversation1",
    participants: ["user1", "user2"],
    messages: [],
  });
};

describe("ChatController", () => {
  it("should send a text message", async () => {
    const message = {
      sender_id: "user1",
      receiver_id: "user2",
      content: "Hello, this is a text message.",
      content_type: "text",
    };
    const response = await request(app)
      .post(`/api/chat/conversation1/send`)
      .send(message);
    expect(response.status).toBe(201);
    expect(response.body.messages.length).toBe(1);
  });

  it("should send a .txt file", async () => {
    const message = {
      sender_id: "user1",
      receiver_id: "user2",
      content_type: "file",
      content_link: "path/to/file.txt",
    };
    const response = await request(app)
      .post(`/api/chat/conversation1/send`)
      .send(message);
    expect(response.status).toBe(201);
    expect(response.body.messages.length).toBe(1);
  });

  it("should send a .jpg file", async () => {
    const message = {
      sender_id: "user1",
      receiver_id: "user2",
      content_type: "file",
      content_link: "path/to/image.jpg",
    };
    const response = await request(app)
      .post(`/api/chat/conversation1/send`)
      .send(message);
    expect(response.status).toBe(201);
    expect(response.body.messages.length).toBe(1);
  });

  it("should send a .png file", async () => {
    const message = {
      sender_id: "user1",
      receiver_id: "user2",
      content_type: "file",
      content_link: "path/to/image.png",
    };
    const response = await request(app)
      .post(`/api/chat/conversation1/send`)
      .send(message);
    expect(response.status).toBe(201);
    expect(response.body.messages.length).toBe(1);
  });

  it("should get all messages", async () => {
    const conversation = await Conversation.findById("conversation1");
    const messages = [
      {
        sender_id: "user1",
        receiver_id: "user2",
        content: "Hello, this is a text message.",
        content_type: "text",
      },
      {
        sender_id: "user1",
        receiver_id: "user2",
        content_type: "file",
        content_link: "path/to/file.txt",
      },
    ];
    conversation.messages = messages;
    await conversation.save();

    const response = await request(app).get(`/api/chat/conversation1/messages`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(messages.length);
  });

  it("should edit a message", async () => {
    const conversation = await Conversation.findById("conversation1");
    const message = {
      sender_id: "user1",
      receiver_id: "user2",
      content: "Hello, this is a text message.",
      content_type: "text",
    };
    conversation.messages.push(message);
    await conversation.save();

    const newContent = "Edited message content";
    const response = await request(app)
      .put(`/api/chat/conversation1/messages/${conversation.messages[0]._id}`)
      .send({ content: newContent });
    expect(response.status).toBe(200);
    expect(response.body.messages[0].content).toBe(newContent);
  });

  it("should delete a message", async () => {
    const conversation = await Conversation.findById("conversation1");
    const message = {
      sender_id: "user1",
      receiver_id: "user2",
      content: "Hello, this is a text message.",
      content_type: "text",
    };
    conversation.messages.push(message);
    await conversation.save();

    const response = await request(app).delete(
      `/api/chat/conversation1/messages/${conversation.messages[0]._id}`
    );
    expect(response.status).toBe(200);
    expect(response.body.messages.length).toBe(0);
  });

  it("should get a single message", async () => {
    const conversation = await Conversation.findById("conversation1");
    const message = {
      sender_id: "user1",
      receiver_id: "user2",
      content: "Hello, this is a text message.",
      content_type: "text",
    };
    conversation.messages.push(message);
    await conversation.save();

    const response = await request(app).get(
      `/api/chat/conversation1/messages/${conversation.messages[0]._id}`
    );
    expect(response.status).toBe(200);
    expect(response.body.content).toBe(message.content);
  });
});
