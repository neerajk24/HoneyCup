
import mongoose from 'mongoose';
import { use, expect as _expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import bcrypt from 'bcryptjs';
import User from '../../src/models/user.js';
import dotenv from 'dotenv';


use(chaiAsPromised);
const expect = _expect;

dotenv.config();

describe('User Model', () => {
    before(async () => {
        // Connect to the database using the value from .env file
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
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