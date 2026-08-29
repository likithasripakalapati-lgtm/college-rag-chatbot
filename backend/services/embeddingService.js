const { GoogleGenerativeAI } = require('@google/generative-ai');
const Chunk = require('../models/Chunk');

// Embedding model
const EMBEDDING_MODEL = 'gemini-embedding-001';

// Lazy-load Gemini API client
let genAI = null;

const getGenAI = () => {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
};
 
/**
 * Generate embedding for a text chunk
 * @param {string} text - The text to embed
 * @returns {Promise<number[]>} Embedding vector
 */
const generateEmbedding = async (text) => {
  try {
    const client = getGenAI();
    const model = client.getGenerativeModel({ model: EMBEDDING_MODEL });
    
    const result = await model.embedContent(text);
    const embedding = result.embedding.values;

    console.log(`Successfully generated embedding for text (${text.substring(0, 50)}...)`);
    return embedding;
  } catch (error) {
    console.error(`Embedding generation error:`, error.message);
    throw error;
  }
};

/**
 * Generate and store embeddings for a chunk
 * Avoids duplicate embeddings by checking if one already exists
 * @param {string} chunkId - MongoDB chunk ID
 * @param {string} chunkText - The text content to embed
 * @returns {Promise<Object>} Updated chunk document
 */
const embedChunk = async (chunkId, chunkText) => {
  let chunk = null;
  
  try {
    // Get the chunk to check if embedding already exists
    chunk = await Chunk.findById(chunkId);
    
    if (!chunk) {
      throw new Error(`Chunk with ID ${chunkId} not found`);
    }

    // Skip if embedding already exists
    if (chunk.embedding && chunk.embeddingStatus === 'completed') {
      console.log(`Embedding already exists for chunk: ${chunkId}`);
      return chunk;
    }

    // Update status to processing
    chunk.embeddingStatus = 'processing';
    await chunk.save();

    console.log(`Generating embedding for chunk: ${chunkId}`);

    // Generate embedding
    const embedding = await generateEmbedding(chunkText);

    // Update chunk with embedding and completed status
    chunk.embedding = embedding;
    chunk.embeddingStatus = 'completed';
    await chunk.save();

    console.log(`Successfully embedded chunk: ${chunkId}`);
    return chunk;
  } catch (error) {
    console.error(`Embedding error for chunk ${chunkId}:`, error.message);

    // Update chunk with failed status
    if (chunk) {
      try {
        chunk.embeddingStatus = 'failed';
        await chunk.save();
      } catch (updateError) {
        console.error('Failed to update chunk embedding status:', updateError.message);
      }
    }

    throw error;
  }
};

/**
 * Generate embeddings for all chunks of a document
 * @param {string} documentId - MongoDB document ID
 * @returns {Promise<number>} Number of chunks embedded
 */
const embedDocument = async (documentId) => {
  try {
    console.log(`Starting embedding generation for document: ${documentId}`);

    // Get all chunks for the document
    const chunks = await Chunk.find({ documentId }).sort({ chunkIndex: 1 });

    if (chunks.length === 0) {
      console.warn(`No chunks found for document: ${documentId}`);
      return 0;
    }

    let embeddedCount = 0;

    // Embed each chunk sequentially to avoid rate limiting
    for (const chunk of chunks) {
      try {
        await embedChunk(chunk._id, chunk.content);
        embeddedCount++;
        
        // Add small delay between requests to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Failed to embed chunk ${chunk._id}:`, error.message);
        // Continue with next chunk on error
      }
    }

    console.log(`Completed embedding generation for document: ${documentId} (${embeddedCount}/${chunks.length} chunks embedded)`);
    return embeddedCount;
  } catch (error) {
    console.error(`Document embedding error for ${documentId}:`, error.message);
    throw error;
  }
};

module.exports = {
  generateEmbedding,
  embedChunk,
  embedDocument,
  EMBEDDING_MODEL
};
