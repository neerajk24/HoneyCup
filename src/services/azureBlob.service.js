// src/services/azureBlob.service.js

import { BlobServiceClient } from "@azure/storage-blob";

const connectionString = "DefaultEndpointsProtocol=https;AccountName=imsstorageaccountuat;AccountKey=STtRdMRjW0VmbGCUbtWc6vjLcjz5qsaE0mSHvuRurvgLbhrOnvqOhrQpbsQ7L/syoBwuph+On3uJ+AStrVvX8g==";
const containerName = "azure-filearchive";

async function uploadFileToAzureBlob(filePath, blobName) {
  const blobServiceClient = new BlobServiceClient(connectionString);
  const containerClient = blobServiceClient.getContainerClient(containerName);

  try {
    await containerClient.createIfNotExists();

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadFromFile(filePath);

    return { message: "File uploaded successfully!", blobUrl: blockBlobClient.url };
  } catch (error) {
    throw new Error(`Error uploading file: ${error.message}`);
  }
}

export async function getFileById(id) {
  // Example: Fetch file details by ID from your storage
  // This would need to be replaced with actual logic to fetch the file
  return { url: `https://example.com/media/${id}` };
}

export async function deleteFileById(id) {
  // Example: Delete a file by ID from your storage
  // This would need to be replaced with actual logic to delete the file
  return true; // Indicate success
}

export default uploadFileToAzureBlob;





































// import { BlobServiceClient } from '@azure/storage-blob';

// const azureBlobService = async (fileBuffer, fileName, contentType) => {
//   const connectionString = "DefaultEndpointsProtocol=https;AccountName=imsstorageaccountuat;AccountKey=STtRdMRjW0VmbGCUbtWc6vjLcjz5qsaE0mSHvuRurvgLbhrOnvqOhrQpbsQ7L/syoBwuph+On3uJ+AStrVvX8g==;EndpointSuffix=core.windows.net";
//                         //process.env.AZURE_STORAGE_CONNECTION_STRING;
//   const containerName = 'azure-filearchive'; // Name of your container in Azure Blob Storage
//   const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
//   const containerClient = blobServiceClient.getContainerClient(containerName);

//   const blockBlobClient = containerClient.getBlockBlobClient(fileName);
//   const uploadBlobResponse = await blockBlobClient.upload(fileBuffer, fileBuffer.length, {
//     blobHTTPHeaders: { blobContentType: contentType }
//   });
//   console.log(`Upload block blob ${fileName} successfully, ${uploadBlobResponse.requestId}`);

//   return blockBlobClient.url;
// };

// export default azureBlobService;