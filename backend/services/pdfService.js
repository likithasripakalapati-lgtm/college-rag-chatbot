const pdfParse = require('pdf-parse');
const fs = require('fs');
const Document = require('../models/Document');
const { createChunks } = require('./chunkingService');

/**
 * Extract text from a PDF file
 * @param {string} filePath - Path to the PDF file
 * @param {string} documentId - MongoDB document ID
 * @returns {Promise<void>}
 */
const extractPDFText = async (filePath, documentId) => {
  try {
    // Update status to processing
    await Document.findByIdAndUpdate(documentId, {
      processingStatus: 'processing'
    });

    console.log(`Extracting text from PDF: ${filePath}`);

    // Read the PDF file
    const pdfBuffer = fs.readFileSync(filePath);

    // Parse the PDF and extract text
    const pdfData = await pdfParse(pdfBuffer);
    const extractedText = pdfData.text;
console.log('Extracted text length:', extractedText ? 
    extractedText.length : 0);
console.log('Extracted text preview:', extractedText ? 
    extractedText.substring(0, 300) : 'EMPTY');

    // Update document with extracted text
    await Document.findByIdAndUpdate(documentId, {
      extractedText: extractedText,
      processedAt: new Date()
    });

    console.log(`Successfully extracted text from document: ${documentId}`);

    // Start chunking in the background (non-blocking)
    createChunks(documentId, extractedText)
      .then(() => {
        console.log(`Chunking completed for document: ${documentId}`);
      })
      .catch((error) => {
        console.error(`Chunking failed for document ${documentId}:`, error.message);
      });

    // Update document status to processed after text extraction
    await Document.findByIdAndUpdate(documentId, {
      processingStatus: 'processed'
    });
  } catch (error) {
    console.error(`PDF extraction error for document ${documentId}:`, error.message);

    // Update document with failed status
    try {
      await Document.findByIdAndUpdate(documentId, {
        processingStatus: 'failed'
      });
    } catch (updateError) {
      console.error('Failed to update document status:', updateError.message);
    }
  }
};

module.exports = {
  extractPDFText
};
