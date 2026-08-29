const express = require('express');
const multer = require('multer');
const path = require('path');
const Document = require('../models/Document');
const Chunk = require('../models/Chunk');
const { extractPDFText } = require('../services/pdfService');

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf'];
  const allowedExtensions = ['.pdf'];

  if (allowedTypes.includes(file.mimetype)) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are supported'));
    }
  } else {
    cb(new Error('Only PDF files are supported'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Upload document route
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided'
      });
    }

    const document = new Document({
      fileName: req.file.filename,
      originalName: req.file.originalname,
      fileType: 'pdf',
      filePath: req.file.path,
      processingStatus: 'uploaded'
    });

    await document.save();

    // Start PDF extraction in the background (non-blocking)
    extractPDFText(req.file.path, document._id).catch((error) => {
      console.error('Background extraction error:', error.message);
    });

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      document: {
        id: document._id,
        fileName: document.fileName,
        originalName: document.originalName,
        fileType: document.fileType,
        filePath: document.filePath,
        uploadedAt: document.uploadedAt,
        processingStatus: document.processingStatus,
        extractedText: document.extractedText,
        processedAt: document.processedAt
      }
    });
  } catch (error) {
    console.error('Document upload error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error uploading document',
      error: error.message
    });
  }
});

// Get document by ID
router.get('/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    res.json({
      success: true,
      document: {
        id: document._id,
        fileName: document.fileName,
        originalName: document.originalName,
        fileType: document.fileType,
        filePath: document.filePath,
        uploadedAt: document.uploadedAt,
        processingStatus: document.processingStatus,
        extractedText: document.extractedText,
        processedAt: document.processedAt,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt
      }
    });
  } catch (error) {
    console.error('Error retrieving document:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error retrieving document',
      error: error.message
    });
  }
});

// Get chunks for a document
router.get('/:id/chunks', async (req, res) => {
  try {
    const chunks = await Chunk.find({ documentId: req.params.id })
      .sort({ chunkIndex: 1 })
      .select('content chunkIndex embeddingStatus createdAt');

    res.json({
      success: true,
      documentId: req.params.id,
      chunkCount: chunks.length,
      chunks: chunks
    });
  } catch (error) {
    console.error('Error retrieving chunks:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error retrieving chunks',
      error: error.message
    });
  }
});

module.exports = router;
