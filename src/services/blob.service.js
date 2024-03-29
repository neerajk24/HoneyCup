// src/services/blobService.js

import { BlobServiceClient } from '@azure/storage-blob';
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

export async function uploadFileToBlob(file, containerName) {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(file.originalname);
    
    const options = { blobHTTPHeaders: { blobContentType: file.mimetype } };
    await blobClient.upload(file.buffer, file.size, options);

    return blobClient.url;
}
