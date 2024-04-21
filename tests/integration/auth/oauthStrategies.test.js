// test/intergration/auth/oauthStrategies.test.js

import chai, { expect } from 'chai';
import sinon from 'sinon';
import passport from 'passport';
import { Strategy as MockStrategy } from 'passport-mock-strategy';
import User from '../../../src/models/user.model.js'; // Adjust the path as necessary

/** 
 * Test suite for OAuth strategies.
 */
describe('OAuth Strategies', () => {
    /**
     * Setup before running the test suite.
     */
    before(() => {
        // Setup the mock strategies
        passport.use(new MockStrategy({
            name: 'google',
            user: {
                id: 'google-123',
                displayName: 'Google Test User',
                emails: [{ value: 'googletest@example.com' }]
            }
        }));

        passport.use(new MockStrategy({
            name: 'facebook',
            user: {
                id: 'facebook-123',
                displayName: 'Facebook Test User',
                emails: [{ value: 'facebooktest@example.com' }]
            }
        }));

        passport.use(new MockStrategy({
            name: 'apple',
            user: {
                id: 'apple-123',
                displayName: 'Apple Test User',
                emails: [{ value: 'appletest@example.com' }]
            }
        }));
    });

    /**
     * Test case: Google authentication
     */
    it('should authenticate user via Google', async () => {
        // Simulate the callback with the mocked profile information
        const profile = {
            id: 'google-123',
            displayName: 'Google Test User',
            emails: [{ value: 'googletest@example.com' }]
        };

        const user = await processOAuthUser(profile);

        expect(user).to.exist;
        expect(user.username).to.equal('Google Test User');
        expect(user.email).to.equal('googletest@example.com');
    });

    /**
     * Test case: Facebook authentication
     */
    it('should authenticate user via Facebook', async () => {
        // Simulate the callback with the mocked profile information
        const profile = {
            id: 'facebook-123',
            displayName: 'Facebook Test User',
            emails: [{ value: 'facebooktest@example.com' }]
        };

        const user = await processOAuthUser(profile);

        expect(user).to.exist;
        expect(user.username).to.equal('Facebook Test User');
        expect(user.email).to.equal('facebooktest@example.com');
    });

    /**
     * Test case: Apple authentication
     */
    it('should authenticate user via Apple', async () => {
        // Simulate the callback with the mocked profile information
        const profile = {
            id: 'apple-123',
            displayName: 'Apple Test User',
            emails: [{ value: 'appletest@example.com' }]
        };

        const user = await processOAuthUser(profile);

        expect(user).to.exist;
        expect(user.username).to.equal('Apple Test User');
        expect(user.email).to.equal('appletest@example.com');
    });

    /**
     * Cleanup after running the test suite.
     */
    after(() => {
        sinon.restore();
    });
});

/**
 * Process the user after successful authentication.
 * @param {Object} profile - The user profile.
 * @returns {Promise<User>} The updated or newly created user.
 */
const processOAuthUser = async (profile) => {
    // Implement the logic to create or update the user based on the OAuth provider
    // For simplicity, assume that the user is created or updated in the same way for all providers
    const user = await User.findOneAndUpdate(
        { oauthId: profile.id },
        { username: profile.displayName, email: profile.emails[0].value },
        { new: true, upsert: true }
    );
    return user;
};
