// jest_test/media.controller.jest_test.js

import request from 'supertest';
import app from '../../../app.js';
import { expect } from 'chai';
import sinon from 'sinon';
import * as azureBlobService from '../../../src/services/azureBlob.service.js';

describe('MediaController', () => {
  describe('POST /api/media/upload', () => {
    it('should return 400 if no file is uploaded', async () => {
      const res = await request(app)
        .post('/api/media/upload')
        .expect(400);

      expect(res.body.message).to.match(/No file uploaded/i);
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

      // Mock the uploadFileToAzureBlob function to resolve with a URL
      const mockUrl = 'https://example.com/test.jpg';
      const uploadFileToAzureBlobStub = sinon.stub(azureBlobService, 'uploadFileToAzureBlob').resolves({ message: 'File uploaded successfully.', blobUrl: mockUrl });

      const res = await request(app)
        .post('/api/media/upload')
        .attach('file', file.buffer, file.originalname)
        .expect(201);

      expect(res.body.message).to.equal('File uploaded successfully.');
      expect(res.body.blobUrl).to.equal(mockUrl);
      uploadFileToAzureBlobStub.restore(); // Restore the stub after the test
    });

    it('should handle errors and return 500 if file upload fails', async () => {
      // Mock the uploadFileToAzureBlob function to throw an error
      const uploadFileToAzureBlobStub = sinon.stub(azureBlobService, 'uploadFileToAzureBlob').rejects(new Error('Mocked error'));

      const res = await request(app)
        .post('/api/media/upload')
        .attach('file', 'test.jpg')
        .expect(500);

      expect(res.body.message).to.equal('Error in uploading file: Mocked error');
      uploadFileToAzureBlobStub.restore(); // Restore the stub after the test
    });
  });

  describe('GET /api/media/:id', () => {
    it('should return 200 and the media URL if media is found', async () => {
      // Mock the file ID
      const fileId = '123';
  
      // Mock the getFileById function to return file details
      const { getFileById } = await import('../../../src/services/azureBlob.service.js');
      sinon.stub(getFileById).resolves({ url: `https://example.com/media/${fileId}` });
  
      const res = await request(app)
        .get(`/api/media/${fileId}`)
        .expect(200);
  
      expect(res.body.url).to.equal(`https://example.com/media/${fileId}`);
      // Add more assertions based on the properties you expect in the response
    });
  
    it('should return 404 if media is not found', async () => {
      // Mock the file ID
      const fileId = 'nonexistent';
  
      // Mock the getFileById function to return null
      const { getFileById } = await import('../../../src/services/azureBlob.service.js');
      sinon.stub(getFileById).resolves(null);
  
      const res = await request(app)
        .get(`/api/media/${fileId}`)
        .expect(404);
  
      expect(res.body.message).to.equal('File not found.');
      // Add more assertions based on the properties you expect in the response
    });
  });
  
  describe('DELETE /api/media/:id', () => {
    it('should return 200 if media is successfully deleted', async () => {
      // Mock the file ID
      const fileId = '123';
  
      // Mock the deleteFileById function to return true
      const { deleteFileById } = await import('../../../src/services/azureBlob.service.js');
      sinon.stub(deleteFileById).resolves(true);
  
      const res = await request(app)
        .delete(`/api/media/${fileId}`)
        .expect(200);
  
      expect(res.body.message).to.equal('File deleted successfully.');
      // Add more assertions based on the properties you expect in the response
    });
  
    it('should return 404 if media is not found or already deleted', async () => {
      // Mock the file ID
      const fileId = 'nonexistent';
  
      // Mock the deleteFileById function to return false
      const { deleteFileById } = await import('../../../src/services/azureBlob.service.js');
      sinon.stub(deleteFileById).resolves(false);
  
      const res = await request(app)
        .delete(`/api/media/${fileId}`)
        .expect(404);
  
      expect(res.body.message).to.equal('File not found or already deleted.');
      // Add more assertions based on the properties you expect in the response
    });
  });
});
