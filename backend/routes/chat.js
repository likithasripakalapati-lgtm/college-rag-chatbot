const express = require('express');
const { processQuestion } = require('../services/ragService');
const Chunk = require('../models/Chunk');

const router = express.Router();

/**
 * POST /api/chat
 * Chat endpoint that processes user questions and returns AI-generated answers
 * with relevant document sources using RAG pipeline
 */
router.post('/', async (req, res) => {
  try {
    const { question } = req.body;

    // Input validation
    if (!question) {
      return res.status(400).json({
        success: false,
        message: 'Question is required'
      });
    }

    if (typeof question !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Question must be a string'
      });
    }

    const trimmedQuestion = question.trim();
    if (trimmedQuestion.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Question cannot be empty'
      });
    }

    if (trimmedQuestion.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Question is too long (maximum 1000 characters)'
      });
    }

    // Check if there are any embedded chunks available
    const embeddedChunkCount = await Chunk.countDocuments({
      embeddingStatus: 'completed',
      embedding: { $exists: true, $ne: null }
    });

    if (embeddedChunkCount === 0) {
      return res.status(400).json({
        success: false,
        message: 'No documents have been processed yet. Please upload and process PDF documents first.'
      });
    }

    console.log(`Processing chat question: "${trimmedQuestion}"`);

    // Process the question through RAG pipeline
    const result = await processQuestion(trimmedQuestion);

    res.json({
      success: true,
      answer: result.answer,
      sources: result.sources || []
    });
  } catch (error) {
    console.error('Chat endpoint error:', error.message);
    
    // Handle specific error types
    if (error.message.includes('API') || error.message.includes('Gemini')) {
      return res.status(503).json({
        success: false,
        message: 'AI service temporarily unavailable. Please try again later.',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error processing your question',
      error: error.message
    });
  }
});

/**
 * POST /api/search
 * Search endpoint that returns relevant chunks without generating an AI answer
 */
router.post('/search', async (req, res) => {
  try {
    const { question, topK = 5 } = req.body;

    // Input validation
    if (!question) {
      return res.status(400).json({
        success: false,
        message: 'Question is required'
      });
    }

    if (typeof question !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Question must be a string'
      });
    }

    const trimmedQuestion = question.trim();
    if (trimmedQuestion.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Question cannot be empty'
      });
    }

    if (!Number.isInteger(topK) || topK < 1 || topK > 20) {
      return res.status(400).json({
        success: false,
        message: 'topK must be an integer between 1 and 20'
      });
    }

    // Check if there are any embedded chunks available
    const embeddedChunkCount = await Chunk.countDocuments({
      embeddingStatus: 'completed',
      embedding: { $exists: true, $ne: null }
    });

    if (embeddedChunkCount === 0) {
      return res.json({
        success: true,
        question: trimmedQuestion,
        results: [],
        message: 'No documents have been processed yet.'
      });
    }

    console.log(`Processing search query: "${trimmedQuestion}"`);

    // Import search service dynamically to avoid circular dependencies
    const { generateEmbedding } = require('../services/embeddingService');
    const { semanticSearch } = require('../services/searchService');
    const Document = require('../models/Document');

    // Step 1: Generate embedding for the question
    const questionEmbedding = await generateEmbedding(trimmedQuestion);

    // Step 2: Semantic search
    const results = await semanticSearch(questionEmbedding, topK);

    // Step 3: Enrich results with document information
    const enrichedResults = await Promise.all(
      results.map(async (result) => {
        const document = await Document.findById(result.documentId).select('originalName fileName');
        return {
          documentId: result.documentId,
          fileName: document?.originalName || document?.fileName || 'Unknown',
          chunkIndex: result.chunkIndex,
          similarity: parseFloat(result.similarity.toFixed(4)),
          preview: result.content.substring(0, 200) + (result.content.length > 200 ? '...' : '')
        };
      })
    );

    res.json({
      success: true,
      question: trimmedQuestion,
      resultCount: enrichedResults.length,
      results: enrichedResults
    });
  } catch (error) {
    console.error('Search endpoint error:', error.message);

    if (error.message.includes('API') || error.message.includes('Gemini')) {
      return res.status(503).json({
        success: false,
        message: 'Search service temporarily unavailable. Please try again later.',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error processing your search',
      error: error.message
    });
  }
});

module.exports = router;
