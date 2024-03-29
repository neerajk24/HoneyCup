// src/api/routes/mediaRoutes.js

const express = require('express');
const multer = require('multer');
const mediaController = require('../controllers/mediaController');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), mediaController.uploadMedia);

module.exports = router;
