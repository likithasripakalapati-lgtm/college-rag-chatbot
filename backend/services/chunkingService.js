const Chunk = require('../models/Chunk');
const { embedDocument } = require('./embeddingService');

// Configuration for chunking
const CHUNK_SIZE = 512; // characters per chunk
const CHUNK_OVERLAP = 50; // overlap between chunks

/**
 * Split text into semantic chunks with configurable size and overlap
 * Prefers splitting at paragraph and sentence boundaries
 * @param {string} text - The text to chunk
 * @param {number} chunkSize - Target size for each chunk
 * @param {number} overlap - Character overlap between chunks
 * @returns {string[]} Array of text chunks
 */
const chunkText = (text, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP) => {
  if (!text || text.length === 0) {
    return [];
  }

  const chunks = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    let endIndex = Math.min(startIndex + chunkSize, text.length);

    // If we're not at the end of the text, try to find a good break point
    if (endIndex < text.length) {
      // Try to break at a paragraph boundary (double newline)
      const paragraphBreak = text.lastIndexOf('\n\n', endIndex);
      if (paragraphBreak > startIndex && paragraphBreak > endIndex - chunkSize * 0.3) {
        endIndex = paragraphBreak;
      } else {
        // Try to break at a sentence boundary (period + space)
        const sentenceBreak = text.lastIndexOf('. ', endIndex);
        if (sentenceBreak > startIndex && sentenceBreak > endIndex - chunkSize * 0.3) {
          endIndex = sentenceBreak + 1;
        } else {
          // Try to break at a line boundary (single newline)
          const lineBreak = text.lastIndexOf('\n', endIndex);
          if (lineBreak > startIndex && lineBreak > endIndex - chunkSize * 0.3) {
            endIndex = lineBreak;
          } else {
            // Try to break at a space
            const spaceBreak = text.lastIndexOf(' ', endIndex);
            if (spaceBreak > startIndex) {
              endIndex = spaceBreak;
            }
          }
        }
      }
    }

    const chunk = text.substring(startIndex, endIndex).trim();
    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    // Move start index for next iteration with overlap
    startIndex = endIndex - overlap;
    if (startIndex < endIndex - overlap + 1) {
      startIndex = endIndex;
    }
  }

  return chunks;
};

/**
 * Create chunks from extracted text and store in MongoDB
 * Avoids creating duplicate chunks by clearing old ones first
 * Triggers embedding generation after chunks are created
 * @param {string} documentId - MongoDB document ID
 * @param {string} extractedText - The extracted text to chunk
 * @returns {Promise<number>} Number of chunks created
 */
const createChunks = async (documentId, extractedText) => {
  try {
    console.log(`Creating chunks for document: ${documentId}`);

    // Delete existing chunks for this document to avoid duplicates
    await Chunk.deleteMany({ documentId });

    // Split text into chunks
    console.log('Extracted text length:', extractedText ? extractedText.length : 0);
console.log('Extracted text preview:', extractedText ? extractedText.substring(0, 200) : 'EMPTY');

const textChunks = chunkText(extractedText);

    if (textChunks.length === 0) {
      console.warn(`No chunks created for document ${documentId}`);
      return 0;
    }

    // Create chunk documents
    const chunkDocuments = textChunks.map((content, index) => ({
      documentId,
      content,
      chunkIndex: index,
      embeddingStatus: 'pending'
    }));

    await Chunk.insertMany(chunkDocuments);

    console.log(`Successfully created ${textChunks.length} chunks for document: ${documentId}`);

    // Start embedding generation in the background (non-blocking)
    embedDocument(documentId).catch((error) => {
      console.error(`Background embedding error for document ${documentId}:`, error.message);
    });

    return textChunks.length;
  } catch (error) {
    console.error(`Chunking error for document ${documentId}:`, error.message);
    throw error;
  }
};

module.exports = {
  chunkText,
  createChunks,
  CHUNK_SIZE,
  CHUNK_OVERLAP
};
