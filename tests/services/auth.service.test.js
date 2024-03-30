
import { expect } from 'chai';
import * as authService from '../../src/services/auth.service.js';
import bcrypt from 'bcryptjs';
import User from '../../src/models/user.model.js';

/**
 * Test suite for the AuthService module.
 */
describe('AuthService', () => {
    /**
     * Test case for the authenticateUser function.
     */
    describe('authenticateUser', () => {
        /**
         * Test case for authenticating a user with correct credentials.
         */
        it('should authenticate a user with correct credentials', async () => {
            // Setup
            const email = 'test@example.com';
            const password = 'password123';
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ email, password: hashedPassword });
            await user.save();

            // Call the function
            const result = await authService.authenticateUser(email, password);

            // Expectations
            expect(result).to.be.true;
        });

        /**
         * Test case for not authenticating a user with incorrect credentials.
         */
        it('should not authenticate a user with incorrect credentials', async () => {
            // Setup
            const email = 'test@example.com';
            const password = 'password123';
            const wrongPassword = 'wrongpassword';
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ email, password: hashedPassword });
            await user.save();

            // Call the function
            const result = await authService.authenticateUser(email, wrongPassword);

            // Expectations
            expect(result).to.be.false;
        });

        /**
         * Test case for returning false for a non-existing user.
         */
        it('should return false for non-existing user', async () => {
            // Setup
            const email = 'nonexisting@example.com';
            const password = 'password123';

            // Call the function
            const result = await authService.authenticateUser(email, password);

            // Expectations
            expect(result).to.be.false;
        });
    });
});
