require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Import routes
const documentsRouter = require('./routes/documents');
const chatRouter = require('./routes/chat');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to CollegeAI RAG Backend');
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'CollegeAI backend is running'
  });
});

// Document routes
app.use('/api/documents', documentsRouter);

// Chat routes (RAG pipeline)
app.use('/api/chat', chatRouter);

// Server configuration
const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
