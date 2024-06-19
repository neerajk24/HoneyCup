import Conversation from "../../models/chats.model.js";
import User from "../../models/user.model.js";
import mongoose from 'mongoose';
import {
    generateAccountSASQueryParameters,
    AccountSASPermissions,
    AccountSASServices,
    AccountSASResourceTypes,
    StorageSharedKeyCredential,
    SASProtocol
} from '@azure/storage-blob'; import { createHmac } from 'crypto';



export const getConversationid = async (req, res) => {
    const { userId1, userId2 } = req.body;
    console.log(`Users have arrived ${userId1} and ${userId2}`);
    if (!userId1 || !userId2) {
        res.status(400).json({ message: "Both the userid's are required" });
    }
    try {
        console.log("here");
        let conversation = await Conversation.findOne({ participants: { $all: [userId1, userId2] } });
        console.log("here also..");
        if (!conversation) {
            conversation = new Conversation({
                participants: [userId1, userId2],
                messages: []
            })
            console.log("New convo is made....");
            await conversation.save();
            console.log("Successfully ssavedd...");
        }
        console.log(`Conversation ID found : ${conversation._id}`);
        res.status(200).json({ conversationId: conversation._id })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

export const getUsernames = async (req, res) => {
    let Ids = [];
    try {
        const users = await User.find({});
        for (let index = 0; index < users.length; index++) {
            Ids.push(users[index].username);
        }
        res.status(200).json({ usernames: Ids });
    } catch (error) {
        res.status(500).json({ message: "Internal Server error", error: error.message });
    }
}

export const getUnreadmsg = async (req, res) => {
    console.log("Unread message route entered");
    const username = req.params.username;
    try {
        const conversations = await Conversation.find({
            participants: { $in: [username] }
        });

        // Object to hold the count of unread messages from each participant
        const unreadMessagesCount = {};
        // Iterate over each conversation
        conversations.forEach(conversation => {
            // Filter messages where the receiver is the username and is_read is false
            const unreadMessages = conversation.messages.filter(msg => msg.receiver_id === username && !msg.is_read);

            // Iterate over unread messages to count them by sender_id
            unreadMessages.forEach(message => {
                if (unreadMessagesCount[message.sender_id]) {
                    unreadMessagesCount[message.sender_id]++;
                } else {
                    unreadMessagesCount[message.sender_id] = 1;
                }
            });
        });

        // Format the response
        const formattedResponse = Object.entries(unreadMessagesCount).map(([sender, count]) => ({
            sender,
            count
        }));
        res.status(200).json(formattedResponse);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export const markMsgRead = async (req, res) => {
    const { conversationId, senderId } = req.body;
    console.log(`ConversationId: ${conversationId} and sender_id: ${senderId}`);
    try {
        const conversationObjectId = new mongoose.Types.ObjectId(conversationId);
        const result = await Conversation.updateOne(
            { _id: conversationObjectId, "messages.sender_id": senderId },
            { $set: { "messages.$[elem].is_read": true } },
            { arrayFilters: [{ "elem.sender_id": senderId }] }
        );
        if (result.nModified === 0) {
            return res.status(404).json({ error: "Conversation or sender not found" });
        }
        res.status(200).json({ message: "Messages marked as read" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", message: error.message });
    }
};

export const generateSasurl = async (req, res) => {
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
    const containerName = 'azure-filearchive';

    try {
        const sharedKeyCredential = new StorageSharedKeyCredential(
            accountName,
            accountKey
        );

        const startTime = new Date(new Date().valueOf() - (5 * 60 * 1000));
        const expiryTime = new Date(new Date().valueOf() + (60 * 60 * 1000)); // 60 minutes from now

        const sasOptions = {
            services: AccountSASServices.parse("btqf").toString(),          // blobs, tables, queues, files
            resourceTypes: AccountSASResourceTypes.parse("sco").toString(), // service, container, object
            permissions: AccountSASPermissions.parse("rwcal").toString(),  // read, write, create, add, list
            protocol: SASProtocol.HttpsAndHttp,
            startsOn: startTime,
            expiresOn: expiryTime,
        };

        const sasToken = generateAccountSASQueryParameters(
            sasOptions,
            sharedKeyCredential
        ).toString();
        const sasUrl = `https://kavoappstorage.blob.core.windows.net/${containerName}?${sasToken}`;
        // Send the SAS Url to the client
        res.status(200).json(sasUrl);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}