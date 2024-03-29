
const mongoose = require('mongoose');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const bcrypt = require('bcryptjs');
const User = require('../models/user');


chai.use(chaiAsPromised);
const expect = chai.expect;

describe('User Model', () => {
    before(async () => {
        // Connect to the database (replace with your string)
        await mongoose.connect('mongodb://localhost/testDatabase', { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterEach(async () => {
        // Clean up the database
        await User.deleteMany({});
    });

    it('should save a user', async () => {
        const user = new User({
            username: 'testuser',
            password: 'testpassword',
            location: {
                type: 'Point',
                coordinates: [1, 1]
            }
        });

        const savedUser = await user.save();

        expect(savedUser).to.exist;
        expect(savedUser.username).to.equal('testuser');
        expect(savedUser).to.have.property('password').that.is.not.equal('testpassword');
    });

    it('should not save a user with a taken username', async () => {
        const user = new User({
            username: 'testuser',
            password: 'testpassword',
            location: {
                type: 'Point',
                coordinates: [1, 1]
            }
        });

        await user.save();

        const user2 = new User({
            username: 'testuser',
            password: 'testpassword2',
            location: {
                type: 'Point',
           coordinates: [2, 2]
            }
        });

        await expect(user2.save()).to.be.rejected;
    });

    it('should check if password is correct', async () => {
        const user = new User({
            username: 'testuser',
            password: 'testpassword',
            location: {
                type: 'Point',
                coordinates: [1, 1]
            }
        });

        const savedUser = await user.save();
        const isPasswordCorrect = await savedUser.correctPassword('testpassword');

        expect(isPasswordCorrect).to.be.true;
    });
});