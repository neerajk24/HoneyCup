


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
import connectDatabase from '../../src/config/database.js';


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
    before(async function() {
        // Ensure the database is connected before tests run
        await connectDatabase();
      });
    
      after(async function() {
        await User.deleteMany({});
        await mongoose.disconnect();
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

    it('should not save a user with a taken username', async () => {
        const user2 = new User({
            username: 'testuser',
            password: 'testpassword2',
            location: {
                type: 'Point',
                coordinates: [2, 2]
            }
        });
    
        try {
            await user2.save();
            throw new Error('Expected an error but did not get one');
        } catch (error) {
            // Check for the duplicate key error code directly
            expect(error.code).to.equal(11000); // E11000 is the error code for duplicate key error
        }
    });
    
    /**
     * Tests if the password is checked correctly.
     */
    it('should check if password is correct', async () => {
        const user = new User({
            username: 'testuser2',
            password: 'testpassword',
            location: {
                type: 'Point',
                coordinates: [1, 1]
            }
        });


        try {
            const savedUser = await user.save();
            const isPasswordCorrect = await savedUser.correctPassword('testpassword');
            expect(isPasswordCorrect).to.be.true;
        } catch (error) {
            expect(error).to.be.instanceOf(mongoose.Error.MongoServerError);
            expect(error.code).to.equal(11000); // E11000 is the error code for duplicate key error
        }
    });
});