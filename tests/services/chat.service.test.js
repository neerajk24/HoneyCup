import { sendMessage } from '../../src/services/chat.service.js';
import Message from '../../src/models/message.model.js';
import User from '../../src/models/user.model.js'; // Existing User model
import sinon from 'sinon';
import { expect } from 'chai';
import mongoose from 'mongoose';

describe('sendMessage', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should send a message when sender and recipient exist', async () => {
    const senderId = '663895a9bbfd50ab1adb3ac7';
    const recipientId = '663895a9bbfd50ab1adb3ac8';
    const content = 'Hello!';
    const messageType = 'text';

    const mockSenderUser = { _id: senderId }; // Plain object with _id property
    const mockRecipientUser = { _id: recipientId };

    sinon.stub(User, 'findById')
      .withArgs(senderId).resolves(mockSenderUser)
      .withArgs(recipientId).resolves(mockRecipientUser);

    const savedMessage = new Message({ sender: senderId, recipient: recipientId, content, messageType });
    sinon.stub(Message.prototype, 'save').resolves(savedMessage);

    const message = await sendMessage(senderId, recipientId, content, messageType);

    expect(message).to.have.property('content', content);
    expect(message).to.have.property('sender', senderId);
    expect(message).to.have.property('recipient', recipientId);
    expect(message).to.have.property('messageType', messageType);
  });

  it('should throw an error if sender or recipient not found', async () => {
    const senderId = '663895a9bbfd50ab1adb3ac7';
    const recipientId = '663895a9bbfd50ab1adb3ac8';
    const content = 'Hello!';
    const messageType = 'text';

    sinon.stub(User, 'findById').resolves(null); // Simulate user not found

    try {
      await sendMessage(senderId, recipientId, content, messageType);
      // If no error is thrown, fail the test
      expect.fail('sendMessage did not throw an error');
    } catch (error) {
      expect(error.message).to.equal('Error sending message: Sender or recipient not found');
    }
  });
});
