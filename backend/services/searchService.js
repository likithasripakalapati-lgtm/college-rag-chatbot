const Chunk = require('../models/Chunk');

/**
 * Calculate cosine similarity between two vectors
 * @param {number[]} vectorA - First embedding vector
 * @param {number[]} vectorB - Second embedding vector
 * @returns {number} Cosine similarity score (0-1)
 */
const cosineSimilarity = (vectorA, vectorB) => {
  if (!vectorA || !vectorB || vectorA.length === 0 || vectorB.length === 0) {
    return 0;
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    magnitudeA += vectorA[i] * vectorA[i];
    magnitudeB += vectorB[i] * vectorB[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
};

/**
 * Search for the most relevant chunks using semantic similarity
 * @param {number[]} questionEmbedding - Embedding of the user question
 * @param {number} topK - Number of top results to return (default: 5)
 * @returns {Promise<Array>} Array of relevant chunks with similarity scores
 */
const semanticSearch = async (questionEmbedding, topK = 5) => {
  try {
    // Get all chunks with completed embeddings
    const chunks = await Chunk.find({
      embeddingStatus: 'completed',
      embedding: { $exists: true, $ne: null }
    }).select('documentId content chunkIndex embedding createdAt');

    if (chunks.length === 0) {
      console.warn('No chunks with embeddings found');
      return [];
    }

    // Calculate similarity scores for each chunk
    const results = chunks.map((chunk) => ({
      id: chunk._id,
      documentId: chunk.documentId,
      content: chunk.content,
      chunkIndex: chunk.chunkIndex,
      similarity: cosineSimilarity(questionEmbedding, chunk.embedding),
      createdAt: chunk.createdAt
    }));

    // Sort by similarity score (descending) and get top K
    const topResults = results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);

    console.log(`Found ${topResults.length} relevant chunks out of ${chunks.length} total`);
    return topResults;
  } catch (error) {
    console.error('Semantic search error:', error.message);
    throw error;
  }
};

module.exports = {
  cosineSimilarity,
  semanticSearch
};
