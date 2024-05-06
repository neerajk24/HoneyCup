import { describe, it, before, afterEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
//import proxyquire from 'proxyquire-universal';
//import proxyquire from 'proxyquire';
import proxyquireify from 'proxyquireify';
const proxyquire = proxyquireify(require);

describe('Chat Controller', () => {
    let req, res, sandbox, sendMessage;

    before(() => {
        sandbox = sinon.createSandbox();
        // Stub dependencies
        const stubs = {
            '../../../src/services/nlp.service.js': {
                analyzeMessage: sandbox.stub().resolves({ isInappropriate: false, isBadImage: false })
            },
            '../../../src/models/message.model.js': {
                './message.model.js': {  // Corrected path for message model
                    create: sandbox.stub().resolves({ _id: 'message_id' })
                }
            },
            '../../../src/models/user.model.js': {
                './user.model.js': {  // Corrected path for user model
                    findById: sandbox.stub().resolves({ continueChat: true })
                }
            }
        };
        // Import the module under test with stubbed dependencies
        sendMessage = proxyquire('../../../src/api/controllers/chat.controller.js', stubs).sendMessage;
    });

    beforeEach(() => {
        req = {
            body: {
                sender: 'sender_id',
                recipient: 'recipient_id',
                content: 'Test message content',
                messageType: 'text',
                isImage: false
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
            sandbox.stub(nlpService, 'analyzeMessage').resolves({ isInappropriate: true, isBadImage: false });

            await sendMessage(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.args[0][0]).to.deep.equal({ error: 'Inappropriate content detected' });
        });

        it('should handle bad image', async () => {
            // Stub the NLP service to return bad image
            sandbox.stub(nlpService, 'analyzeMessage').resolves({ isInappropriate: false, isBadImage: true });

            await sendMessage(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.args[0][0]).to.deep.equal({ error: 'Inappropriate content detected' });
        });

        it('should handle errors', async () => {
            // Stub the NLP service
            sandbox.stub(nlpService, 'analyzeMessage').throws(new Error('NLP service error'));

            await sendMessage(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.args[0][0]).to.deep.equal({ error: 'NLP service error' });
        });
    });
});



// import { describe, it, before, after } from 'mocha';
// import { expect } from 'chai';
// import sinon from 'sinon';
// import { sendMessage } from '../../../src/api/controllers/chat.controller.js';
// import Message from '../../../src/models/message.model.js';
// import User from '../../../src/models/user.model.js';
// import * as nlpService from '../../../src/services/nlp.service.js';

// describe('Chat Controller', () => {
//     let req, res, sandbox;

//     before(() => {
//         sandbox = sinon.createSandbox();
//     });

//     beforeEach(() => {
//         req = {
//             body: {
//                 sender: 'sender_id',
//                 recipient: 'recipient_id',
//                 content: 'Test message content',
//                 messageType: 'text',
//                 isImage: false
//             }
//         };

//         res = {
//             status: sandbox.stub().returnsThis(),
//             json: sandbox.stub()
//         };
//     });

//     afterEach(() => {
//         sandbox.restore();
//     });

//     describe('sendMessage', () => {
//         it('should send a message successfully', async () => {
//             // Stub the NLP service
//             const analyzeMessageStub = sandbox.stub(nlpService, 'analyzeMessage').resolves({ isInappropriate: false, isBadImage: false });

//             // Stub user find operations
//             sandbox.stub(User, 'findById').resolves({ continueChat: true });

//             // Stub message create operation
//             sandbox.stub(Message, 'create').resolves({ _id: 'message_id' });

//             await sendMessage(req, res);

//             expect(res.status.calledWith(201)).to.be.true;
//             expect(res.json.calledOnce).to.be.true;
//             expect(Message.create.calledOnce).to.be.true;

//             const messageData = res.json.args[0][0];
//             expect(messageData).to.have.property('message');
//             expect(messageData.message._id).to.equal('message_id');
//         });

//         it('should handle inappropriate content', async () => {
//             // Stub the NLP service to return inappropriate content
//             sandbox.stub(nlpService, 'analyzeMessage').resolves({ isInappropriate: true, isBadImage: false });

//             await sendMessage(req, res);

//             expect(res.status.calledWith(400)).to.be.true;
//             expect(res.json.calledOnce).to.be.true;
//             expect(res.json.args[0][0]).to.deep.equal({ error: 'Inappropriate content detected' });
//         });

//         it('should handle bad image', async () => {
//             // Stub the NLP service to return bad image
//             sandbox.stub(nlpService, 'analyzeMessage').resolves({ isInappropriate: false, isBadImage: true });

//             await sendMessage(req, res);

//             expect(res.status.calledWith(400)).to.be.true;
//             expect(res.json.calledOnce).to.be.true;
//             expect(res.json.args[0][0]).to.deep.equal({ error: 'Inappropriate content detected' });
//         });

//         it('should handle errors', async () => {
//             // Stub the NLP service
//             sandbox.stub(nlpService, 'analyzeMessage').throws(new Error('NLP service error'));

//             await sendMessage(req, res);

//             expect(res.status.calledWith(500)).to.be.true;
//             expect(res.json.calledOnce).to.be.true;
//             expect(res.json.args[0][0]).to.deep.equal({ error: 'NLP service error' });
//         });
//     });
// });