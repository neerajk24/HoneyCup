// src/api/controllers/media.controller.js

import uploadFileToAzureBlob, {
  getFileById,
  deleteFileById,
} from "../../services/azureBlob.service.js";
import fs from "fs/promises";

export const uploadFile = async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }

    const filePath = file.path; // Multer saves the file with this path
    const blobName = file.originalname;

    // Read file into buffer
    const buffer = await fs.readFile(filePath);

    // Upload file buffer to Azure Blob Storage
    const uploadResult = await uploadFileToAzureBlob(buffer, blobName);
    return res.status(201).json(uploadResult);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: `Error in uploading file: ${error.message}` });
  }
};

export const fetchMedia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fileDetails = await getFileById(id);

    if (!fileDetails) {
      return res.status(404).send({ message: "File not found." });
    }

    res.status(200).send({ url: fileDetails.url });
  } catch (error) {
    next(error);
  }
};

export const deleteMedia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletionResult = await deleteFileById(id);

    if (!deletionResult) {
      return res
        .status(404)
        .send({ message: "File not found or already deleted." });
    }

    res.status(200).send({ message: "File deleted successfully." });
  } catch (error) {
    next(error);
  }
};
