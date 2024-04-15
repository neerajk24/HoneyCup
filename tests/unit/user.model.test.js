


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
     * 1. Tests if a user can be saved successfully.
     */
    it('should save a user', async () => {
        const userData = {
            username: 'testuser',
            password: 'testpassword',
            email: 'test@test.com',
            location: {
                type: 'Point',
                coordinates: [1, 1]
            }
        };

        const user = new User(userData);
        const savedUser = await user.save();

        expect(savedUser).to.exist;
        expect(savedUser.username).to.equal(userData.username);
        expect(savedUser).to.have.property('password').that.is.not.equal(userData.password);
    });

    /**
     * 2. Tests if a user can be retrieved by ID.
     */
    it('should retrieve a user by ID', async () => {
        const userData = {
            username: 'testuser_ID',
            password: 'testpassword_ID',
            location: {
                type: 'Point',
                coordinates: [1, 1]
            }
        };

        const user = new User(userData);
        await user.save();

        const retrievedUser = await User.findById(user._id);

        expect(retrievedUser).to.exist;
        expect(retrievedUser.username).to.equal(userData.username);
    });

    /**
     * 3. Tests if a user can be updated.
     */
    it('should update a user', async () => {
        const userData = {
            username: 'testuser_old',
            password: 'testpassword_old',
            location: {
                type: 'Point',
                coordinates: [1, 1]
            }
        };

        const user = new User(userData);
        await user.save();

        user.username = 'updateduser';
        const updatedUser = await user.save();

        expect(updatedUser).to.exist;
        expect(updatedUser.username).to.equal('updateduser');
    });

    /**
     * 4. Tests if a user can be deleted.
     */
    it('should delete a user', async () => {
        const userData = {
            username: 'testuser_delete',
            password: 'testpassword_delete',
            location: {
                type: 'Point',
                coordinates: [1, 1]
            }
        };

        const user = new User(userData);
        await user.save();

        await User.findByIdAndDelete(user._id);

        const deletedUser = await User.findById(user._id);
        expect(deletedUser).to.not.exist;
    });

    /**
     * 5. Tests if the username field is required.
     */
    it('should require the username field', async () => {
        const userData = {
            password: 'testpassword',
            location: {
                type: 'Point',
                coordinates: [1, 1]
            }
        };

        const user = new User(userData);

        // Try to save the user without the username field
        await expect(user.save()).to.be.rejectedWith(mongoose.Error.ValidationError);
    });

    /**
     * 6. Tests if the email field is unique.
     */
    it('should ensure the email field is unique', async () => {
        const dumy_userData = {
            username: 'testuser_email',
            email: 'test@test.com', 
            password: 'dumy_password',
            location: {
                type: 'Point',
                coordinates: [2, 3]
            }
        };

        const dumy_user = new User(dumy_userData);
        dumy_user.save();
        
        const userData = {
            username: 'testuser_email_unique',
            email: 'test@test.com', // Existing email
            password: 'testpassword',
            location: {
                type: 'Point',
                coordinates: [1, 1]
            }
        };

        const user = new User(userData);

        try {
            await user.save();
            throw new Error('Expected an error but did not get one');
        } catch (error) {
            // Check for the duplicate key error code directly
            expect(error.code).to.equal(11000); // E11000 is the error code for duplicate key error
        }
    });

    /**
     * 7. Tests if the username field is required.
     */
    it('should require the username field', async () => {
        const userData = {
            password: 'testpassword',
            location: {
                type: 'Point',
                coordinates: [1, 1]
            }
        };

        const user = new User(userData);

        // Try to save the user without the username field
        await expect(user.save()).to.be.rejectedWith(mongoose.Error.ValidationError);
    });

    /**
     * 8. Tests if the email field is sparse.
     */
    it('should ensure the email field is sparse', async () => {
        const userData = {
            username: 'testuser2',
            password: 'testpassword',
            location: {
                type: 'Point',
                coordinates: [1, 1]
            }
        };

        const user = new User(userData);
        const savedUser = await user.save();

        expect(savedUser).to.exist;
        expect(savedUser.email).to.not.exist;
    });

    /**
     * 9. Tests if the username field is unique.
     */
    it('should ensure the username field is unique', async () => {
        const userData1 = {
            username: 'testuser_name_unique',
            email: 'test1unique@test.com',
            password: 'testpassword_uniquename',
            location: {
                type: 'Point',
                coordinates: [3, 4]
            }
        };
    
        const userData2 = {
            username: 'testuser_name_unique',
            email: 'test2unique@test.com',
            password: 'testpassword_unique_name',
            location: {
                type: 'Point',
                coordinates: [1, 1]
            }
        };
    
        const user1 = new User(userData1);
        const user2 = new User(userData2);
    
        await user1.save();
    
        // Try to save the second user with the same username
        await expect(user2.save()).to.be.rejectedWith(mongoose.Error.MongoServerError);
    });
    
});
