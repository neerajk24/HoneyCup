
/**
 * This file contains tests for the Google OAuth strategy.
 */

import chai, { expect } from 'chai';
import sinon from 'sinon';
import passport from 'passport';
import { Strategy as MockStrategy } from 'passport-mock-strategy';
import User from '../../../src/models/user.model.js';


/**
 * Test suite for Google OAuth.
 */
describe('Google OAuth', () => {
    /**
     * Setup before running the test suite.
     */
    before(() => {
        // Setup the mock strategy
        passport.use(new MockStrategy({
            name: 'google',
            user: {
                id: 'google-123',
                displayName: 'Test User',
                emails: [{ value: 'testuser@example.com' }]
            }
        }));
    });

    /**
     * Test case: should create or update a user upon successful authentication.
     */
    it('should create or update a user upon successful authentication', async () => {
        /**
         * Process the user after successful authentication.
         * @param {Object} profile - The user profile.
         * @returns {Promise<User>} The updated or newly created user.
         */
        const processUser = async (profile) => {
            const user = await User.findOneAndUpdate(
                { googleId: profile.id },
                { username: profile.displayName, email: profile.emails[0].value },
                { new: true, upsert: true }
            );
            return user;
        };

        // Simulate the callback with the mocked profile information
        const profile = {
            id: 'google-123',
            displayName: 'Test User',
            emails: [{ value: 'testuser@example.com' }]
        };
        
        const user = await processUser(profile);

        expect(user).to.exist;
        expect(user.username).to.equal('Test User');
        expect(user.email).to.equal('testuser@example.com');
        // Further assertions as needed
    });

    /**
     * Cleanup after running the test suite.
     */
    after(() => {
        sinon.restore();
    });
});
