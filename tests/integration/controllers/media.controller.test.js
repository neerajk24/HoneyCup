import request from 'supertest';
import app from '../../../app.js'; // Adjust the path as necessary
import { expect } from 'chai';

describe('MediaController', () => {
  describe('POST /upload', () => {
    it('should return 400 if no file is uploaded', async () => {
      const res = await request(app)
        .post('/api/upload')
        .expect(400);

      expect(res.body).to.have.property('message', 'No file uploaded.');
    });

    it('should return 201 and the file URL if file is uploaded successfully', async () => {
      // Mock the file upload
      const file = {
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 12345,
        buffer: Buffer.from('test file content'),
      };

      const res = await request(app)
        .post('/api/upload')
        .attach('file', file.buffer, file.originalname)
        .expect(201);

      expect(res.body).to.have.property('message', 'File uploaded successfully.');
      expect(res.body).to.have.property('url');
      // Add more assertions based on the properties you expect in the response
    });

    it('should handle errors and call the error handling middleware', async () => {
      // Mock the file upload
      const file = {
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 12345,
        buffer: Buffer.from('test file content'),
      };

      // Mock the blobService.uploadFileToBlob function to throw an error
      const blobService = require('../../../src/services/blob.service.js');
      blobService.uploadFileToBlob = () => {
        throw new Error('Mocked error');
      };

      const res = await request(app)
        .post('/api/upload')
        .attach('file', file.buffer, file.originalname)
        .expect(500);

      expect(res.body).to.have.property('message', 'Internal Server Error');
      // Add more assertions based on the error handling behavior you expect
    });
  });
});