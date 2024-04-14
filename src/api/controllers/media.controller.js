// src/api/controllers/media.controller.js
import uploadFileToAzureBlob from '../../services/azureBlob.service.js';

export const uploadFile = async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }

    const filePath = file.tempFilePath; 
    const blobName = file.originalname;

    const uploadResult = await uploadFileToAzureBlob(filePath, blobName); // Direct function call (assuming default export)
    return res.status(200).json(uploadResult);
  } catch (error) {
    console.error(error);
    console.log(req.file);
    return res.status(500).json({ message: "Error in catch of uploading file!" });
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
