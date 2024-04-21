// tests/integration/controllers/user.controller.test.js

import request from 'supertest';
import app from '../../../app.js'; // Adjust the path as necessary
import { expect } from 'chai';
import sinon from 'sinon';
import * as userService from '../../../src/services/user.service.js';

describe('UserController', () => {
  describe('POST /api/user/profile', () => {
    it('should return 200 and the updated profile for a valid request', async () => {
      const mockUserId = 'mockUserId';
      const mockRequestBody = { name: 'John Doe', age: 30 };

      // Mock the userService.updateUserProfile function
      const updateUserProfileStub = sinon.stub(userService, 'updateUserProfile').resolves({ id: mockUserId, ...mockRequestBody });

      // Send a request to the updateUserProfile endpoint
      const res = await request(app)
        .post('/api/user/profile')
        .set('Authorization', 'Bearer mockToken')
        .send(mockRequestBody);

      // Assert the response status code and body
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.deep.equal({ id: mockUserId, ...mockRequestBody });

      // Restore the stub
      updateUserProfileStub.restore();
    });

    it('should return 400 and an error message for an invalid request', async () => {
      const mockErrorMessage = 'Invalid request';

      // Mock the userService.updateUserProfile function to throw an error
      const updateUserProfileStub = sinon.stub(userService, 'updateUserProfile').throws(new Error(mockErrorMessage));

      // Send a request to the updateUserProfile endpoint
      const res = await request(app)
        .post('/api/user/profile')
        .set('Authorization', 'Bearer mockToken')
        .send({});

      // Assert the response status code and body
      expect(res.statusCode).to.equal(400);
      expect(res.body).to.deep.equal({ message: mockErrorMessage });

      // Restore the stub
      updateUserProfileStub.restore();
    });
  });

  describe('POST /api/user/profile', () => {
    it('should return 401 if no authentication token is provided', async () => {
      const res = await request(app)
        .post('/api/user/profile')
        .send({});

      expect(res.statusCode).to.equal(401);
    });

    it('should return 403 if an invalid authentication token is provided', async () => {
      const res = await request(app)
        .post('/api/user/profile')
        .set('Authorization', 'Bearer invalidToken')
        .send({});

      expect(res.statusCode).to.equal(403);
    });

    it('should return 400 if request body is invalid', async () => {
      const res = await request(app)
        .post('/api/user/profile')
        .set('Authorization', 'Bearer validToken')
        .send({ invalidField: 'value' });

      expect(res.statusCode).to.equal(400);
    });
  });
  
    describe('POST /api/user/login', () => {
      it('should return 200 and a token for valid credentials', async () => {
        // Mock the userService.authenticateUser function
        const authenticateUserStub = sinon.stub(userService, 'authenticateUser').resolves('mockToken');
  
        // Send a request to the login endpoint
        const res = await request(app)
          .post('/api/user/login')
          .send({ email: 'test@example.com', password: 'password123' });
  
        // Assert the response status code and body
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('token', 'mockToken');
  
        // Restore the userService.authenticateUser function
        authenticateUserStub.restore();
      });
  
      it('should return 401 for invalid credentials', async () => {
        // Mock the userService.authenticateUser function to throw an error
        const authenticateUserStub = sinon.stub(userService, 'authenticateUser').throws(new Error('Invalid credentials'));
  
        // Send a request to the login endpoint
        const res = await request(app)
          .post('/api/user/login')
          .send({ email: 'invalid@example.com', password: 'invalidPassword' });
  
        // Assert the response status code
        expect(res.statusCode).to.equal(401);
  
        // Restore the userService.authenticateUser function
        authenticateUserStub.restore();
      });
    });
  
});
