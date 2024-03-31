// src/api/controllers/media.controller.js
import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Assuming you have a service for handling blob storage or similar
import blobService from '../../services/blobService.js';

// Set up multer for file uploads
const uploadPath = path.join(__dirname, '..', '..', 'uploads');
const upload = multer({ dest: uploadPath });

export const uploadFile = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).send({ message: 'No file uploaded.' });
        }

        // Example: Upload the file to blob storage and get the URL
        const containerName = 'media'; // Adjust as needed
        const blobUrl = await blobService.uploadFileToBlob(req.file, containerName);

        res.status(201).send({ message: 'File uploaded successfully.', url: blobUrl });
    } catch (error) {
        next(error);
    }
};

export const fetchMedia = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Example: Fetch the file URL or path from your storage based on the ID
        const fileDetails = await blobService.getFileById(id);

        if (!fileDetails) {
            return res.status(404).send({ message: 'File not found.' });
        }

        // Example response with file URL
        res.status(200).send({ url: fileDetails.url });
    } catch (error) {
        next(error);
    }
};

export const deleteMedia = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Example: Delete the file from your storage based on the ID
        const deletionResult = await blobService.deleteFileById(id);

        if (!deletionResult) {
            return res.status(404).send({ message: 'File not found or already deleted.' });
        }

        res.status(200).send({ message: 'File deleted successfully.' });
    } catch (error) {
        next(error);
    }
};

// You might need to export the multer upload if it's used outside this module
export { upload };
