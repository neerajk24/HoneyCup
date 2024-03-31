import request from 'supertest';
import app from '../../../app.js'; // Adjust the path as necessary
import { expect } from 'chai';

describe('UserController', () => {
  describe('POST /api/user/profile', () => {
    it('should return 200 and the updated profile for a valid request', async () => {
      const mockUserId = 'mockUserId';
      const mockRequestBody = { name: 'John Doe', age: 30 };

      // Mock the userService.updateUserProfile function
      const userServiceMock = {
        updateUserProfile: async (userId, requestBody) => {
          // Assert that the userId and requestBody are correct
          expect(userId).to.equal(mockUserId);
          expect(requestBody).to.deep.equal(mockRequestBody);

          // Return the updated profile
          return { id: mockUserId, ...requestBody };
        },
      };

      // Replace the actual userService with the mock
      const originalUserService = require('../../../src/api/services/user.service.js');
      require.cache[require.resolve('../../../src/api/services/user.service.js')].exports = userServiceMock;

      // Send a request to the updateUserProfile endpoint
      const res = await request(app)
        .post('/api/user/profile')
        .set('Authorization', 'Bearer mockToken')
        .send(mockRequestBody);

      // Assert the response status code and body
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.deep.equal({ id: mockUserId, ...mockRequestBody });

      // Restore the original userService
      require.cache[require.resolve('../../../src/api/services/user.service.js')].exports = originalUserService;
    });

    it('should return 400 and an error message for an invalid request', async () => {
      const mockErrorMessage = 'Invalid request';

      // Mock the userService.updateUserProfile function to throw an error
      const userServiceMock = {
        updateUserProfile: async () => {
          throw new Error(mockErrorMessage);
        },
      };

      // Replace the actual userService with the mock
      const originalUserService = require('../../../src/api/services/user.service.js');
      require.cache[require.resolve('../../../src/api/services/user.service.js')].exports = userServiceMock;

      // Send a request to the updateUserProfile endpoint
      const res = await request(app)
        .post('/api/user/profile')
        .set('Authorization', 'Bearer mockToken')
        .send({});

      // Assert the response status code and body
      expect(res.statusCode).to.equal(400);
      expect(res.body).to.deep.equal({ message: mockErrorMessage });

      // Restore the original userService
      require.cache[require.resolve('../../../src/api/services/user.service.js')].exports = originalUserService;
    });
  });
});