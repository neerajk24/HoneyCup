import { expect } from 'chai';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import sinon from 'sinon';
import User from '../../../src/models/user.model.js';
import { addFriend, removeFriend, getFriends } from '../../../src/api/controllers/friends.controller.js';

describe('Friends Controller', () => {
    let mongoServer;
    let user1;
    let user2;

    before(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);

        user1 = new User({
            username: 'user1',
            email: 'user1@example.com',
            password: 'password123'
        });
        user2 = new User({
            username: 'user2',
            email: 'user2@example.com',
            password: 'password123'
        });

        await user1.save();
        await user2.save();
    });

    after(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongoServer.stop();
    });

    describe('addFriend', () => {
        it('should add a friend successfully', async () => {
            const req = {
                body: {
                    userId: user1._id.toString(),
                    friendId: user2._id.toString()
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };

            await addFriend(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.calledWith({ message: 'Friend added successfully' })).to.be.true;

            const updatedUser = await User.findById(user1._id);
            expect(updatedUser.friends).to.include(user2._id);
        });

        it('should return 404 if user not found', async () => {
            const req = {
                body: {
                    userId: new mongoose.Types.ObjectId().toString(), // Non-existing user ID
                    friendId: user2._id.toString()
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };

            await addFriend(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.calledWith({ error: 'User not found' })).to.be.true;
        });
    });

    describe('removeFriend', () => {
        it('should remove a friend successfully', async () => {
            // First add a friend
            user1.friends.push(user2._id);
            await user1.save();

            const req = {
                body: {
                    userId: user1._id.toString(),
                    friendId: user2._id.toString()
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };

            await removeFriend(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.calledWith({ message: 'Friend removed successfully' })).to.be.true;

            const updatedUser = await User.findById(user1._id);
            expect(updatedUser.friends).to.not.include(user2._id);
        });

        it('should return 404 if user not found', async () => {
            const req = {
                body: {
                    userId: new mongoose.Types.ObjectId().toString(), // Non-existing user ID
                    friendId: user2._id.toString()
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };

            await removeFriend(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.calledWith({ error: 'User not found' })).to.be.true;
        });
    });

    describe('getFriends', () => {
        it('should get the list of friends successfully', async () => {
            // First add a friend
            user1.friends.push(user2._id);
            await user1.save();

            const req = {
                params: {
                    userId: user1._id.toString()
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };

            await getFriends(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.args[0][0].friends[0]).to.have.property('username', 'user2');
            expect(res.json.args[0][0].friends[0]).to.have.property('email', 'user2@example.com');
        });

        it('should return 404 if user not found', async () => {
            const req = {
                params: {
                    userId: new mongoose.Types.ObjectId().toString() // Non-existing user ID
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };

            await getFriends(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.calledWith({ error: 'User not found' })).to.be.true;
        });
    });
});



// import { expect } from 'chai';
// import sinon from 'sinon';
// import { addFriend, removeFriend, getFriends } from '../../../src/api/controllers/friends.controller.js';
// import User from '../../../src/models/user.model.js';

// describe('Friends Controller', () => {
//     describe('addFriend', () => {
//         it('should add a friend successfully', async () => {
//             // Test case 1: Add a friend successfully
//             const req = {
//                 body: {
//                     userId: 'user_id',
//                     friendId: 'friend_id'
//                 }
//             };
//             const res = {
//                 status: sinon.stub().returnsThis(),
//                 json: sinon.spy()
//             };
//             sinon.stub(User, 'findById').resolves({ addFriend: sinon.stub().resolves() });

//             await addFriend(req, res);

//             expect(res.status.calledWith(200)).to.be.true;
//             expect(res.json.calledOnce).to.be.true;
//             expect(res.json.calledWith({ message: 'Friend added successfully' })).to.be.true;

//             User.findById.restore();
//         });

//         it('should return 404 if user not found', async () => {
//             // Test case 2: User not found
//             const req = {
//                 body: {
//                     userId: 'user_id',
//                     friendId: 'friend_id'
//                 }
//             };
//             const res = {
//                 status: sinon.stub().returnsThis(),
//                 json: sinon.spy()
//             };
//             sinon.stub(User, 'findById').resolves(null);

//             await addFriend(req, res);

//             expect(res.status.calledWith(404)).to.be.true;
//             expect(res.json.calledOnce).to.be.true;
//             expect(res.json.calledWith({ error: 'User not found' })).to.be.true;

//             User.findById.restore();
//         });

//         // Add more test cases as needed
//     });

//     describe('removeFriend', () => {
//         it('should remove a friend successfully', async () => {
//             // Test case 1: Remove a friend successfully
//             const req = {
//                 body: {
//                     userId: 'user_id',
//                     friendId: 'friend_id'
//                 }
//             };
//             const res = {
//                 status: sinon.stub().returnsThis(),
//                 json: sinon.spy()
//             };
//             sinon.stub(User, 'findById').resolves({ removeFriend: sinon.stub().resolves() });
        
//             await removeFriend(req, res);
        
//             expect(res.status.calledWith(200)).to.be.true;
//             expect(res.json.calledOnce).to.be.true;
//             expect(res.json.calledWith({ message: 'Friend removed successfully' })).to.be.true;
        
//             User.findById.restore();
//         });
        
//         it('should return 404 if user not found', async () => {
//             // Test case 2: User not found
//             const req = {
//                 body: {
//                     userId: 'user_id',
//                     friendId: 'friend_id'
//                 }
//             };
//             const res = {
//                 status: sinon.stub().returnsThis(),
//                 json: sinon.spy()
//             };
//             sinon.stub(User, 'findById').resolves(null);
        
//             await removeFriend(req, res);
        
//             expect(res.status.calledWith(404)).to.be.true;
//             expect(res.json.calledOnce).to.be.true;
//             expect(res.json.calledWith({ error: 'User not found' })).to.be.true;
        
//             User.findById.restore();
//         });
//     });

//     describe('getFriends', () => {
//         let findByIdStub;
    
//         beforeEach(() => {
//             findByIdStub = sinon.stub(User, 'findById');
//         });
    
//         afterEach(() => {
//             findByIdStub.restore();
//         });
    
//         it('should get the list of friends successfully', async () => {
//             // Test case 1: Get list of friends successfully
//             const req = {
//                 params: {
//                     userId: '6650aa476612de23f0712885' // Replace 'user_id' with a valid user ID
//                 }
//             };
//             const res = {
//                 status: sinon.stub().returnsThis(),
//                 json: sinon.spy()
//             };
//             // Stub the response with the correct list of friends
//             findByIdStub.resolves({ friends: [{ username: 'friend1', email: 'friend1@example.com' }] });
    
//             await getFriends(req, res);
    
//             // Assertions
//             expect(res.status.calledWith(200)).to.be.true;
//             expect(res.json.calledOnce).to.be.true;
//             expect(res.json.calledWith({ friends: [{ username: 'friend1', email: 'friend1@example.com' }] })).to.be.true;
//         });
    
//         it('should return 404 if user not found', async () => {
//             // Test case 2: User not found
//             const req = {
//                 params: {
//                     userId: 'invalid_user_id' // Replace 'invalid_user_id' with a non-existing user ID
//                 }
//             };
//             const res = {
//                 status: sinon.stub().returnsThis(),
//                 json: sinon.spy()
//             };
    
//             // Stub the response with null (user not found)
//             findByIdStub.resolves(null);
    
//             await getFriends(req, res);
    
//             // Assertions
//             expect(res.status.calledWith(404)).to.be.true;
//             expect(res.json.calledOnce).to.be.true;
//             expect(res.json.calledWith({ error: 'User not found' })).to.be.true;
//         });
//     });
// });
