// src/api/controllers/mediaController.js

const blobService = require('../../services/blobService');

exports.uploadMedia = async (req, res, next) => {
    try {
        if (!req.file) {
            throw new Error('No file uploaded.');
        }
        
        const containerName = 'media'; // Replace with your actual container name
        const blobUrl = await blobService.uploadFileToBlob(req.file, containerName);
        
        res.status(201).send({ message: 'File uploaded successfully.', url: blobUrl });
    } catch (error) {
        next(error);
    }
};
