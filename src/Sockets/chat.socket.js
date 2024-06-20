// src/Socket/chat.socket.js

import Conversation from "../models/chats.model.js";
import mongoose from "mongoose";
import axios from "axios";
import { generateServiceBusToken } from "./../api/controllers/socket.Chat.controller.js";
import { ServiceBusClient } from "@azure/service-bus";

const connectionString =
  "Endpoint=sb://chats-service-bus.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=3v34BGBWIDCd6d7q1FyWcUuFJtpuJIrDE+ASbKyROJQ=";
const serviceBusClient = new ServiceBusClient(connectionString);

let ConnectedSockets = [
  // {Userid , socketId}
];

export const ChatSocket = (io) => {
  io.on("connection", (socket) => {
    const Userid = socket.handshake.auth.userid;
    ConnectedSockets.push({
      socketId: socket.id,
      Userid,
    });
    console.log(`${Userid} got connected..`);
    io.emit(
      "onlineUsers",
      ConnectedSockets.map((s) => s.Userid)
    );
    socket.on("joinRoom", async ({ userId, conversationId }) => {
      console.log(`User ${userId} trying to join the room ${conversationId}`);
      socket.join(conversationId);
      // Convert the conversationId string to an ObjectId
      const conversationObjectId = new mongoose.Types.ObjectId(conversationId);
      const chat = await Conversation.findOne({ _id: conversationObjectId });
      if (chat) {
        socket.emit("previousMessages", chat.messages);
      }
    });

    socket.on("sendMessages", async ({ conversationId, message }) => {
      console.log(`${conversationId} is trying to send ${message}`);
      console.log(
        `${conversationId} is trying to send ${JSON.stringify(
          message,
          null,
          2
        )}`
      );

      const queueName =
        message.content_type === "text"
          ? "text_message_queue"
          : "file_message_queue";

      try {
        await sendMessageToQueue(queueName, message);
      } catch (error) {
        console.error("Error in sendMessageToQueue:", error);
      }

      io.to(conversationId).emit("recieveMessage", message);

      // Convert the conversationId string to an ObjectId
      const conversationObjectId = new mongoose.Types.ObjectId(conversationId);

      // Check if both users are online in the room
      const usersInRoom = io.sockets.adapter.rooms.get(conversationId);
      const isReceiverOnline = usersInRoom && usersInRoom.size === 2;
      // Set is_read to true if both users are online
      message.is_read = isReceiverOnline;
      const chat = await Conversation.findOne({ _id: conversationObjectId });
      if (chat) {
        chat.messages.push(message);
        await chat.save();
      } else {
        console.log("Error in sending messages Chat not found!");
      }

      // Use of Connection string for adding message to queue
      // try {

      //   const sender = serviceBusClient.createSender(queueName);

      //   console.log("Message object before stringify:", message);
      //   const messageToSend = {
      //     body: JSON.stringify(message),
      //     contentType: "application/json",
      //   };
      //   console.log("Message data after stringify:", messageToSend);

      //   await sender.sendMessages(messageToSend);
      //   console.log("Message sent to Service Bus queue");

      //   await sender.close();
      // } catch (error) {
      //   console.error("Error sending message to Service Bus queue:", error);
      // }

      // Use the SAS token from socket.Chat.controller.js

      // Call finction sendMessageToQueue(queueName, message) to add message to queue

      // try {
      //   await sendMessageToQueue(queueName, message);
      // } catch (error) {
      //   console.error("Error in sendMessageToQueue:", error);
      // }

      // send the new unreadMsg to the disconnected User
      if (!isReceiverOnline) {
        console.log("oops user hasn't seen messages");
        const SOCKET = ConnectedSockets.find(
          (soc) => soc.Userid === message.receiver_id
        );
        if (SOCKET) {
          console.log("unseen user found");
          const response = await axios.get(
            `http://localhost:3000/api/socketChat/chats/getUnreadmsg/${message.receiver_id}`
          );
          io.to(SOCKET.socketId).emit("unreadMessages", response.data);
          console.log("Unread data send to the user");
        }
      }
    });

    socket.on("userTyping", ({ conversationId, receiverId, typing }) => {
      const usersInRoom = io.sockets.adapter.rooms.get(conversationId);
      const isReceiverOnline = usersInRoom && usersInRoom.size === 2;

      if (isReceiverOnline) {
        const receiverSocket = ConnectedSockets.find(
          (soc) => soc.Userid === receiverId
        );
        if (receiverSocket) {
          io.to(receiverSocket.socketId).emit("typing", typing);
        }
      }
    });

    socket.on("disconnect", () => {
      ConnectedSockets = ConnectedSockets.filter(
        (soc) => soc.Userid !== Userid
      );
      io.emit(
        "onlineUsers",
        ConnectedSockets.map((s) => s.Userid)
      );
      console.log(socket.id + " disconnected");
    });
  });
};

export const sendMessageToQueue = async (queueName, message) => {
  const sasToken = await generateServiceBusToken();
  const namespace = "Chats-service-bus.servicebus.windows.net";

  const url = `https://${namespace}/${queueName}/messages?timeout=60&api-version=2017-04`;
  const headers = {
    Authorization: sasToken,
    "Content-Type": "application/json",
  };
  console.log("Headers:", headers);

  try {
    console.log("Sending message to Service Bus queue:", message);
    console.log("SAS token recived by sendMessageToQueue", sasToken);
    console.log("Headers:", headers);

    const response = await axios.post(url, { body: message }, { headers });
    console.log("Message sent to Service Bus queue", response.data);
  } catch (error) {
    console.error("Error sending message to Service Bus queue:", error);
  }
};
