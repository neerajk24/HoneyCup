// src/services/azureBlob.service.js

import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = "azure-filearchive";

const blobServiceClient =
  BlobServiceClient.fromConnectionString(connectionString);

export async function uploadFileToAzureBlob(buffer, blobName) {
  const containerClient = blobServiceClient.getContainerClient(containerName);

  try {
    await containerClient.createIfNotExists();

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadData(buffer); // Correct method name

    return {
      message: "File uploaded successfully!",
      blobUrl: blockBlobClient.url,
    };
  } catch (error) {
    throw new Error(`Error uploading file: ${error.message}`);
  }
}

export async function getFileById(blobName) {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlockBlobClient(blobName);

  const exists = await blobClient.exists();
  if (!exists) {
    return null;
  }

  return { url: blobClient.url };
}

export async function deleteFileById(blobName) {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlockBlobClient(blobName);

  const exists = await blobClient.exists();
  if (!exists) {
    return false;
  }

  await blobClient.delete();
  return true;
}

export default uploadFileToAzureBlob;
