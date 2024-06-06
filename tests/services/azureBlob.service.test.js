// src/services/azureBlob.service.test.js

// src/services/azureBlob.service.test.js

import sinon from "sinon";
import { expect } from "chai";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises"; // Import fs/promises for reading file
import {
  uploadFileToAzureBlob,
  getFileById,
  deleteFileById,
} from "../../src/services/azureBlob.service.js";
import { BlobServiceClient } from "@azure/storage-blob";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe("Azure Blob Service", () => {
  // Mock instances
  let blobServiceClientMock, containerClientMock, blockBlobClientMock;

  beforeEach(() => {
    blobServiceClientMock = sinon.createStubInstance(BlobServiceClient);
    containerClientMock = {
      createIfNotExists: sinon.stub(),
      getBlockBlobClient: sinon.stub(),
    };
    blockBlobClientMock = {
      uploadData: sinon.stub(),
      exists: sinon.stub(),
      delete: sinon.stub(),
    };

    // Stubbing methods
    sinon
      .stub(BlobServiceClient, "fromConnectionString")
      .returns(blobServiceClientMock);
    blobServiceClientMock.getContainerClient.returns(containerClientMock);
    containerClientMock.getBlockBlobClient.returns(blockBlobClientMock);
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should upload a file successfully", async () => {
    // Test data
    const buffer = await fs.readFile(resolve(__dirname, "test_uploaded.txt"));
    const blobName = "test_uploaded.txt";
    blockBlobClientMock.uploadData.resolves();
    blockBlobClientMock.url =
      "https://kavoappstorage.blob.core.windows.net/azure-filearchive/test_uploaded.txt";

    // Test execution
    const result = await uploadFileToAzureBlob(buffer, blobName);

    // Logging
    console.log(
      "Container createIfNotExists called:",
      containerClientMock.createIfNotExists.called
    );
    console.log(
      "BlockBlobClient uploadData called with buffer:",
      blockBlobClientMock.uploadData.calledWith(buffer)
    );
    console.log("Result:", result);

    // Assertions
    expect(containerClientMock.createIfNotExists.called).to.be.true;
    expect(blockBlobClientMock.uploadData.calledWith(buffer)).to.be.true;
    expect(result).to.deep.equal({
      message: "File uploaded successfully!",
      blobUrl: blockBlobClientMock.url,
    });
  });

  it("should handle file upload error", async () => {
    // Test data
    const buffer = await fs.readFile(resolve(__dirname, "test_uploaded.txt"));
    const blobName = "test_uploaded.txt";
    blockBlobClientMock.uploadData.rejects(new Error("Upload error"));

    // Test execution and assertions
    try {
      await uploadFileToAzureBlob(buffer, blobName);
    } catch (error) {
      console.log("Caught error:", error);
      expect(error.message).to.equal("Error uploading file: Upload error");
    }
  });

  it("should return file URL if file exists", async () => {
    // Test data
    const blobName = "URL_return_test.txt.txt";
    blockBlobClientMock.exists.resolves(true);
    blockBlobClientMock.url =
      "https://kavoappstorage.blob.core.windows.net/azure-filearchive/URL_return_test.txt.txt";

    // Test execution
    const result = await getFileById(blobName);

    // Logging
    console.log(
      "BlockBlobClient exists called:",
      blockBlobClientMock.exists.calledOnce
    );
    console.log("Result URL:", result.url);
    console.log("Expected URL:", blockBlobClientMock.url);

    // Assertions
    expect(blockBlobClientMock.exists.calledOnce).to.be.true;
    expect(result.url.trim().toLowerCase()).to.equal(
      blockBlobClientMock.url.trim().toLowerCase()
    );
  });

  it("should return null if file does not exist", async () => {
    // Test data
    const blobName = "non.txt";
    blockBlobClientMock.exists.resolves(false);

    // Test execution
    const result = await getFileById(blobName);

    // Logging
    console.log(
      "BlockBlobClient exists called:",
      blockBlobClientMock.exists.calledOnce
    );
    console.log("Result:", result);

    // Assertions
    expect(blockBlobClientMock.exists.calledOnce).to.be.true;
    expect(result).to.be.null;
  });

  it("should delete a file successfully", async () => {
    // Test data
    const blobName = "delete_file_test.txt.txt";
    blockBlobClientMock.exists.resolves(true);
    blockBlobClientMock.delete.resolves();
    blockBlobClientMock.url =
      "https://kavoappstorage.blob.core.windows.net/azure-filearchive/delete_file_test.txt.txt";

    // Test execution
    const result = await deleteFileById(blobName);

    // Logging
    console.log(
      "BlockBlobClient exists called:",
      blockBlobClientMock.exists.calledOnce
    );
    console.log(
      "BlockBlobClient delete called:",
      blockBlobClientMock.delete.calledOnce
    );
    console.log("Result:", result);

    // Assertions
    expect(blockBlobClientMock.exists.calledOnce).to.be.true;
    expect(blockBlobClientMock.delete.calledOnce).to.be.true;
    expect(result).to.be.true;
  });

  it("should return false if file does not exist for deletion", async () => {
    // Test data
    const blobName = "non.txt";
    blockBlobClientMock.exists.resolves(false);

    // Test execution
    const result = await deleteFileById(blobName);

    // Logging
    console.log(
      "BlockBlobClient exists called:",
      blockBlobClientMock.exists.calledOnce
    );
    console.log("Result:", result);

    // Assertions
    expect(blockBlobClientMock.exists.calledOnce).to.be.true;
    expect(result).to.be.false;
  });
});
