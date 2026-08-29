const mongoose = require('mongoose');

const chunkSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
      index: true
    },
    content: {
      type: String,
      required: true
    },
    chunkIndex: {
      type: Number,
      required: true
    },
    embedding: {
      type: [Number],
      default: null,
      sparse: true
    },
    embeddingStatus: {
      type: String,
      default: 'pending',
      enum: ['pending', 'processing', 'completed', 'failed']
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index for documentId and chunkIndex for unique chunks per document
chunkSchema.index({ documentId: 1, chunkIndex: 1 }, { unique: true });

module.exports = mongoose.model('Chunk', chunkSchema);
