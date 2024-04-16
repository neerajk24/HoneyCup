
/**
 * @fileOverview Unit tests for the Message Model.
 * @module message.model.test
 */

import mongoose from 'mongoose';
import { use, expect as _expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Message from '../../src/models/message.model.js';
import User from '../../src/models/user.model.js'; // Import User model if required
import connectDatabase from '../../src/config/database.js';

use(chaiAsPromised);
const expect = _expect;

/**
 * Describes the unit tests for the Message Model.
 */
describe('Message Model', () => {
    /**
     * Sets up the test environment by connecting to the database.
     */
    before(async function() {
        // Ensure the database is connected before tests run
        await connectDatabase();
    });

    after(async function() {
        // Clean up after all tests are done
        await Message.deleteMany({});
        await mongoose.disconnect();
    });

    /**
     * 1. Tests if a message can be saved successfully.
     */
    it('should save a message', async () => {
        const senderId = new mongoose.Types.ObjectId();
        const receiverId = new mongoose.Types.ObjectId();
        const messageData = {
            sender: senderId,
            receiver: receiverId,
            content: 'Test message content'
        };

        const message = new Message(messageData);
        const savedMessage = await message.save();

        expect(savedMessage).to.exist;
        expect(savedMessage.sender).to.eql(senderId);
        expect(savedMessage.receiver).to.eql(receiverId);
        expect(savedMessage.content).to.equal(messageData.content);
        expect(savedMessage.timestamp).to.be.a('Date');
    });

    /**
     * 2. Tests if a message can be retrieved by ID.
     */
    it('should retrieve a message by ID', async () => {
        const senderId = new mongoose.Types.ObjectId();
        const receiverId = new mongoose.Types.ObjectId();
        const messageData = {
            sender: senderId,
            receiver: receiverId,
            content: 'Test message content'
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
    it('should update a message', async () => {
        const senderId = new mongoose.Types.ObjectId();
        const receiverId = new mongoose.Types.ObjectId();
        const messageData = {
            sender: senderId,
            receiver: receiverId,
            content: 'Test message content'
        };

        const message = new Message(messageData);
        await message.save();

        const newContent = 'Updated message content';
        message.content = newContent;
        await message.save();

        const updatedMessage = await Message.findById(message._id);

        expect(updatedMessage).to.exist;
        expect(updatedMessage.content).to.equal(newContent);
    });

    /**
     * 4. Tests if a message can be deleted.
     */
    it('should delete a message', async () => {
        const senderId = new mongoose.Types.ObjectId();
        const receiverId = new mongoose.Types.ObjectId();
        const messageData = {
            sender: senderId,
            receiver: receiverId,
            content: 'Test message content'
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
    it('should delete multiple messages', async () => {
        // Create multiple messages
        const messageData1 = { sender: new mongoose.Types.ObjectId(), receiver: new mongoose.Types.ObjectId(), content: 'Message 1' };
        const messageData2 = { sender: new mongoose.Types.ObjectId(), receiver: new mongoose.Types.ObjectId(), content: 'Message 2' };
        const messageData3 = { sender: new mongoose.Types.ObjectId(), receiver: new mongoose.Types.ObjectId(), content: 'Message 3' };
        
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
    it('should retrieve multiple messages', async () => {
        // Create multiple messages
        const messageData1 = { sender: new mongoose.Types.ObjectId(), receiver: new mongoose.Types.ObjectId(), content: 'Message 1' };
        const messageData2 = { sender: new mongoose.Types.ObjectId(), receiver: new mongoose.Types.ObjectId(), content: 'Message 2' };
        
        await Message.create([messageData1, messageData2]);

        // Retrieve multiple messages
        const retrievedMessages = await Message.find();

        // Verify retrieval
        expect(retrievedMessages).to.have.lengthOf.at.least(2);
    });

    /**
     * 7. Tests if required fields (sender, receiver, content) are enforced.
     */
    it('should require sender, receiver, and content fields', async () => {
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
        expect(error.errors.sender.kind).to.equal('required');
        expect(error.errors.receiver).to.exist;
        expect(error.errors.receiver.kind).to.equal('required');
        expect(error.errors.content).to.exist;
        expect(error.errors.content.kind).to.equal('required');
    });

});
