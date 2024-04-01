import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { uploadFileToBlob, getFileById, deleteFileById } from '../../services/blob.service.js'; // Adjust path as necessary

// Convert the URL of the current module to a file path
const __filename = fileURLToPath(import.meta.url);
// Get the directory name of the current module
const __dirname = path.dirname(__filename);

// Set up multer for file uploads
const uploadPath = path.join(__dirname, '..', '..', 'uploads');
const upload = multer({ dest: uploadPath });

export const uploadFile = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).send({ message: 'No file uploaded.' });
        }

        const containerName = 'media'; // Adjust as needed
        //const blobUrl = await uploadFileToBlob(req.file, containerName);
        const blobUrl = "http://example.com/mock-url-for-uploaded-file";

        res.status(201).send({ message: 'File uploaded successfully.', url: blobUrl });
    } catch (error) {
        next(error);
    }
};

export const fetchMedia = async (req, res, next) => {
    try {
        const { id } = req.params;
        const fileDetails = await getFileById(id);

        if (!fileDetails) {
            return res.status(404).send({ message: 'File not found.' });
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
            return res.status(404).send({ message: 'File not found or already deleted.' });
        }

        res.status(200).send({ message: 'File deleted successfully.' });
    } catch (error) {
        next(error);
    }
};

// Assuming you want to use this multer instance for routes related to media uploads
export { upload };
