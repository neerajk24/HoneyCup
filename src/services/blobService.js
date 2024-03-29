// src/services/blobService.js

const { BlobServiceClient } = require('@azure/storage-blob');
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

exports.uploadFileToBlob = async (file, containerName) => {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(file.originalname);
    
    const options = { blobHTTPHeaders: { blobContentType: file.mimetype } };
    await blobClient.upload(file.buffer, file.size, options);

    return blobClient.url;
};
