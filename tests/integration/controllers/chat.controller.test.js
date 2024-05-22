// tests/integration/controllers/chat.controller.test.js 

import { describe, it, before, afterEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { createChatController } from '../../../src/api/controllers/chat.controller.js';

describe('Chat Controller', () => {
    let req, res, sandbox, sendMessage, deleteMessage, editMessage, getMessage, nlpService, Message, User;

    before(() => {
        sandbox = sinon.createSandbox();

        // Stub dependencies
        nlpService = {
            analyzeMessage: sandbox.stub().resolves({ isInappropriate: false, isBadImage: false })
        };
        Message = {
            create: sandbox.stub().resolves({ _id: 'message_id' }),
            findByIdAndDelete: sandbox.stub().resolves({}),
            findByIdAndUpdate: sandbox.stub().resolves({ content: 'Updated message content' }),
            findById: sandbox.stub().resolves({ content: 'Test message content' })
        };
        User = {
            findById: sandbox.stub().resolves({ continueChat: true })
        };

        // Create controller instance with stubbed dependencies
        const chatController = createChatController({ nlpService, Message, User });
        sendMessage = chatController.sendMessage;
        deleteMessage = chatController.deleteMessage;
        editMessage = chatController.editMessage;
        getMessage = chatController.getMessage;
    });

    beforeEach(() => {
        req = {
            body: {
                sender: 'sender_id',
                recipient: 'recipient_id',
                content: 'Test message content',
                messageType: 'text',
                isImage: false
            },
            params: {
                messageId: 'message_id'
            }
        };

        res = {
            status: sandbox.stub().returnsThis(),
            json: sandbox.stub()
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('sendMessage', () => {
        it('should send a message successfully', async () => {
            await sendMessage(req, res);

            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.args[0][0].message._id).to.equal('message_id');
        });

        it('should handle inappropriate content', async () => {
            // Stub the NLP service to return inappropriate content
            nlpService.analyzeMessage.resolves({ isInappropriate: true, isBadImage: false });

            await sendMessage(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.args[0][0]).to.deep.equal({ error: 'Inappropriate content detected' });
        });

        it('should handle bad image', async () => {
            // Stub the NLP service to return bad image
            nlpService.analyzeMessage.resolves({ isInappropriate: false, isBadImage: true });

            await sendMessage(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.args[0][0]).to.deep.equal({ error: 'Inappropriate content detected' });
        });

        it('should handle errors', async () => {
            // Stub the NLP service
            nlpService.analyzeMessage.throws(new Error('NLP service error'));

            await sendMessage(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.args[0][0]).to.deep.equal({ error: 'NLP service error' });
        });
    });

    describe('deleteMessage', () => {
        it('should delete a message successfully', async () => {
            await deleteMessage(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.args[0][0]).to.deep.equal({ message: 'Message deleted successfully' });
        });

        it('should handle message not found', async () => {
            Message.findByIdAndDelete.resolves(null);

            await deleteMessage(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.args[0][0]).to.deep.equal({ error: 'Message not found' });
        });

        it('should handle errors', async () => {
            Message.findByIdAndDelete.throws(new Error('Database error'));

            await deleteMessage(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.args[0][0]).to.deep.equal({ error: 'Database error' });
        });
    });

    describe('editMessage', () => {
        it('should edit a message successfully', async () => {
            req.body.content = 'Updated message content';

            await editMessage(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.args[0][0].content).to.equal('Updated message content');
        });

        it('should handle message not found', async () => {
            Message.findByIdAndUpdate.resolves(null);

            await editMessage(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.args[0][0]).to.deep.equal({ error: 'Message not found' });
        });

        it('should handle errors', async () => {
            Message.findByIdAndUpdate.throws(new Error('Database error'));

            await editMessage(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.args[0][0]).to.deep.equal({ error: 'Database error' });
        });
    });

    describe('getMessage', () => {
        it('should get a message successfully', async () => {
            await getMessage(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.args[0][0].content).to.equal('Test message content');
        });

        it('should handle message not found', async () => {
            Message.findById.resolves(null);

            await getMessage(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.args[0][0]).to.deep.equal({ error: 'Message not found' });
        });

        it('should handle errors', async () => {
            Message.findById.throws(new Error('Database error'));

            await getMessage(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.args[0][0]).to.deep.equal({ error: 'Database error' });
        });
    });
});
