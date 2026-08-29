const { GoogleGenerativeAI } = require('@google/generative-ai');
const { generateEmbedding } = require('./embeddingService');
const { semanticSearch } = require('./searchService');
const Document = require('../models/Document');

// Configuration
const CHAT_MODEL = 'gemini-3.5-flash-lite';
const TOP_K_CHUNKS = 5;

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
 * Build context string from retrieved chunks
 * @param {Array} chunks - Array of relevant chunks
 * @returns {Promise<string>} Formatted context string with sources
 */
const buildContext = async (chunks) => {
  if (chunks.length === 0) {
    return 'No relevant documents found in the knowledge base.';
  }

  let context = 'Based on the following college documents:\n\n';

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const document = await Document.findById(chunk.documentId).select('originalName');
    const docName = document?.originalName || 'Unknown Document';

    context += `[Source: ${docName}, Chunk ${chunk.chunkIndex}]\n`;
    context += `${chunk.content}\n\n`;
  }

  return context;
};

/**
 * Generate answer using Gemini based on retrieved context
 * @param {string} question - User question
 * @param {Array} retrievedChunks - Array of relevant chunks from semantic search
 * @returns {Promise<Object>} Object with answer and sources
 */
const generateAnswer = async (question, retrievedChunks) => {
  try {
    console.log(`Generating answer for question: "${question}"`);

    // Build context from retrieved chunks
    const context = await buildContext(retrievedChunks);

    // Create system prompt
    const systemPrompt = `You are a helpful college information assistant. Answer questions based ONLY on the provided college documents. 
    
Rules:
- Answer using only the provided college document context
- If the information is not available in the documents, clearly state: "This information is not available in the uploaded college documents."
- Provide clear, student-friendly answers
- Cite which documents you're referencing when relevant
- Be concise but helpful
Do NOT include source names, chunk numbers, citations, or match percentages in the answer.
- Sources will be displayed separately by the application.`;

    // Create message
    const userMessage = `Context from college documents:\n\n${context}\n\nQuestion: ${question}`;

    // Generate answer using Gemini
    const client = getGenAI();
    const model = client.getGenerativeModel({ model: CHAT_MODEL });

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }]
        },
        {
          role: 'model',
          parts: [{ text: 'Understood. I will answer questions based only on the provided college documents.' }]
        }
      ]
    });

    const result = await chat.sendMessage(userMessage);
    const answer = result.response.text();

    console.log('Successfully generated answer');

    return {
      success: true,
      answer: answer,
      sources: retrievedChunks.map((chunk) => ({
        documentId: chunk.documentId,
        chunkIndex: chunk.chunkIndex,
        similarity: chunk.similarity
      }))
    };
  } catch (error) {
    console.error('Answer generation error:', error.message);
    throw error;
  }
};

/**
 * Complete RAG pipeline: Question → Embedding → Search → Answer
 * @param {string} question - User question
 * @param {number} topK - Number of top chunks to retrieve (default: 5)
 * @returns {Promise<Object>} Answer with sources
 */
const processQuestion = async (question, topK = TOP_K_CHUNKS) => {
  try {
    console.log(`Processing question: "${question}"`);

    // Validate input
    if (!question || typeof question !== 'string') {
      throw new Error('Invalid question: must be a non-empty string');
    }

    const trimmedQuestion = question.trim();
    if (trimmedQuestion.length === 0) {
      throw new Error('Question cannot be empty');
    }

    // Step 1: Generate embedding for the question
    console.log('Step 1: Generating question embedding...');
    const questionEmbedding = await generateEmbedding(trimmedQuestion);

    // Step 2: Semantic search for relevant chunks
    console.log('Step 2: Searching for relevant chunks...');
    const retrievedChunks = await semanticSearch(questionEmbedding, topK);

    if (retrievedChunks.length === 0) {
      console.warn('No relevant chunks found');
      return {
        success: true,
        answer: 'I could not find relevant information in the uploaded college documents to answer your question. Please try asking about different aspects of the college.',
        sources: []
      };
    }

    // Step 3: Generate answer using Gemini
    console.log('Step 3: Generating answer with Gemini...');
    const result = await generateAnswer(trimmedQuestion, retrievedChunks);

    // Step 4: Enrich sources with document names
    const enrichedResult = await enrichSources(result);

    return enrichedResult;
  } catch (error) {
    console.error('RAG pipeline error:', error.message);
    throw error;
  }
};

/**
 * Enrich sources with document file names
 * @param {Object} result - Result object with sources
 * @returns {Promise<Object>} Enriched result
 */
const enrichSources = async (result) => {
  try {
    const enrichedSources = await Promise.all(
      result.sources.map(async (source) => {
        const document = await Document.findById(source.documentId).select('originalName fileName');
        return {
          ...source,
          fileName: document?.originalName || document?.fileName || 'Unknown'
        };
      })
    );

    return {
      ...result,
      sources: enrichedSources
    };
  } catch (error) {
    console.error('Error enriching sources:', error.message);
    // Return result without enrichment if error occurs
    return result;
  }
};

module.exports = {
  processQuestion,
  generateAnswer,
  buildContext,
  CHAT_MODEL,
  TOP_K_CHUNKS
};
