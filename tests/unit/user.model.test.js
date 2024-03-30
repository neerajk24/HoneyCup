


/**
 * @fileOverview Unit tests for the User Model.
 * @module user.model.test
 */

import mongoose from 'mongoose';
import { use, expect as _expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import bcrypt from 'bcryptjs';
import User from '../../src/models/user.model.js';
import dotenv from 'dotenv';
import UserController from '../../src/api/controllers/user.controller.js';

use(chaiAsPromised);
const expect = _expect;

dotenv.config();

/**
 * Describes the unit tests for the User Model.
 */
describe('User Model', () => {
    /**
     * Sets up the test environment by connecting to the database.
     */
    before(async () => {
        // Connect to the database using the value from .env file
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    /**
     * Cleans up the database after each test.
     */
    afterEach(async () => {
        // Clean up the database
        await User.deleteMany({});
    });

    /**
     * Tests if a user can be saved successfully.
     */
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

    /**
     * Tests if a user with a taken username cannot be saved.
     */
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

    /**
     * Tests if the password is checked correctly.
     */
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