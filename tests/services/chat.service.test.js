import { sendMessage } from '../../src/services/chat.service.js';
import Message from '../../src/models/message.model.js';
import User from '../../src/models/user.model.js'; 
import sinon from 'sinon';
import { expect } from 'chai';
import mongoose from 'mongoose';

describe('sendMessage', () => {
  let senderId;
  let recipientId;

  before(async function() {
    // Check mongoose connection status
    if (mongoose.connection.readyState !== 1) {
      // If not connected, try to connect
      await mongoose.connect('mongodb://localhost:27017/honeyCup');
    }

    // Retrieve the IDs of the users from the database
    try {
      const sender = await User.findOne({ username: 'user1' }).select('_id');
      const recipient = await User.findOne({ username: 'user2' }).select('_id');
      console.log('Sender:', sender);
      console.log('Recipient:', recipient);

      if (!sender || !recipient) {
        throw new Error('Sender or recipient not found');
      }

      senderId = sender._id;
      recipientId = recipient._id;
    } catch (error) {
      console.error('Error during before hook:', error);
      throw error; // Rethrow the error to fail the test
    }
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should send a message when sender and recipient exist', async () => {
    const content = 'Hello! From test message from chat.service.text.js';

    // Stub the User.findById method to resolve with mock user objects
    sinon.stub(User, 'findById')
      .withArgs(senderId).resolves({ _id: senderId })
      .withArgs(recipientId).resolves({ _id: recipientId });

    const savedMessage = new Message({ sender: senderId, receiver: recipientId, content });
    sinon.stub(savedMessage, 'save').resolves(savedMessage);

    const message = await sendMessage(senderId, recipientId, content);

    expect(message).to.have.property('content', content);
    expect(message).to.have.property('sender', senderId);
    expect(message).to.have.property('receiver', recipientId); // Check receiver property
  });

  it('should throw an error if sender or recipient not found', async () => {
    // Stub the User.findById method to resolve with null, simulating user not found
    sinon.stub(User, 'findById').resolves(null);

    try {
      await sendMessage(senderId, recipientId, 'Hello! From test message from chat.service.text.js');
      // If no error is thrown, fail the test
      expect.fail('sendMessage did not throw an error');
    } catch (error) {
      expect(error.message).to.equal('Error sending message: Sender or recipient not found');
    }
  });
});
