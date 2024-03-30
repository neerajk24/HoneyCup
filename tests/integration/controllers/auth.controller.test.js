/**
 * Integration tests for the AuthController.
 */
import request from 'supertest';
import app from '../../../app.js'; // Adjust this path as necessary
import { expect } from 'chai';

/**
 * Test suite for the POST /login endpoint.
 */
describe('AuthController', () => {
    /**
     * Test case for valid credentials.
     */
    describe('POST /login', () => {
        /**
         * Test the POST /login endpoint with valid credentials.
         * It should return 200 and a token.
         */
        it('should return 200 and a token for valid credentials', async () => {
            const res = await request(app)
                .post('/api/login')
                .send({ email: 'user@example.com', password: 'password' });
            
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.have.property('token');
        });
    });

    /**
     * Test case for invalid credentials.
     */
    describe('POST /login', () => {
        /**
         * Test the POST /login endpoint with invalid credentials.
         * It should return 400 and an error message.
         */
        it('should return 400 for invalid credentials', async () => {
            const res = await request(app)
                .post('/api/login')
                .send({ email: 'invalid@example.com', password: 'wrongpassword' });
            
            expect(res.statusCode).to.equal(400);
            expect(res.body).to.have.property('error');
        });
    });
});
