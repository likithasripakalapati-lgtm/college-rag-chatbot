# CollegeAI RAG Chatbot - Quick Start Guide

Complete AI-powered college information chatbot with RAG (Retrieval-Augmented Generation) pipeline.

## 📦 Project Overview

```
college-rag-chatbot/
├── backend/              # Node.js + Express RAG backend
│   ├── models/          # MongoDB schemas
│   ├── services/        # Business logic (PDF, embedding, RAG)
│   ├── routes/          # API endpoints
│   ├── uploads/         # PDF storage
│   └── server.js        # Main entry point
│
└── frontend/            
    └── college-ai/      # Next.js React frontend
        ├── components/  # React components
        ├── lib/         # API utilities
        ├── app/         # Next.js pages
        └── public/      # Static assets
```

## 🚀 Getting Started (5 minutes)

### Terminal 1: Start Backend

```bash
cd backend
npm install
npm start
```

Expected output:
```
MongoDB connected successfully
Server is running on port 5000
✓ Backend ready at http://localhost:5000
```

### Terminal 2: Start Frontend

```bash
cd frontend/college-ai
npm install
npm run dev
```

Expected output:
```
▲ Next.js 16.3.3
- Local:        http://localhost:3000
✓ Frontend ready at http://localhost:3000
```

### Terminal 3 (Optional): Monitor Logs

Keep this open to watch backend processing:
```bash
# In backend directory, run:
tail -f server-logs.txt  # if you set up logging
```

## 🔄 Workflow - From Upload to Answer

### Step 1: Upload a College PDF
1. Open frontend at `http://localhost:3000`
2. Scroll to "Admin - Upload College Documents"
3. Select a PDF file (e.g., `college-handbook.pdf`)
4. Click "Upload PDF"
5. See success message
6. Backend automatically: extracts text → chunks it → generates embeddings

### Step 2: Ask a Question
1. Go to chat interface
2. Type: `"What are the hostel facilities?"`
3. Press Enter or click Send
4. Wait for loading indicator
5. AI responds with: answer + sources

### Step 3: See Results
- **Answer**: AI-generated response based on college documents
- **Sources**: Shows which documents were used, chunk index, similarity score (0-1)
- **Similarity**: Higher = more relevant (0.8+ is very relevant)

## 📋 Key Features

### Backend Features
✅ PDF upload and storage
✅ Text extraction from PDFs
✅ Semantic text chunking
✅ Gemini AI embeddings
✅ Cosine similarity search
✅ RAG answer generation
✅ MongoDB data persistence
✅ Error handling & logging

### Frontend Features
✅ Modern chat interface
✅ Document upload with validation
✅ Real-time connection status
✅ Loading states
✅ Error messages
✅ Source attribution
✅ Responsive design
✅ Empty state guidance

## 🔑 Key API Endpoints

### Chat
- `POST /api/chat` - Ask questions
- `POST /api/chat/search` - Search without AI answer

### Documents
- `POST /api/documents/upload` - Upload PDF
- `GET /api/documents/:id` - Get document details
- `GET /api/documents/:id/chunks` - Get text chunks

### System
- `GET /api/health` - Check backend status
- `GET /` - Welcome message

## 🎯 Testing Checklist

### Backend Tests
- [ ] Backend starts without errors
- [ ] MongoDB connection successful
- [ ] PDF upload returns success
- [ ] Chat endpoint responds

### Frontend Tests
- [ ] Frontend loads at localhost:3000
- [ ] Backend connection indicator works
- [ ] Can type and submit questions
- [ ] Chat displays messages
- [ ] Upload section works
- [ ] Sources display correctly

### Full Workflow Test
- [ ] Upload sample PDF
- [ ] Wait for processing (2-5 seconds)
- [ ] Ask related question
- [ ] Get AI answer with sources
- [ ] Verify answer makes sense
- [ ] Check similarity scores

## 📊 Data Flow Diagram

```
User Uploads PDF
     ↓
API: POST /api/documents/upload
     ↓
Backend Processing:
  1. PDF extraction (pdfService)
  2. Text chunking (chunkingService)
  3. Embedding generation (embeddingService)
  4. Store in MongoDB
     ↓
Frontend Ready Signal
     ↓
User Asks Question
     ↓
API: POST /api/chat
     ↓
Backend RAG Pipeline:
  1. Embed question (embeddingService)
  2. Semantic search (searchService)
  3. Retrieve context (top 5 chunks)
  4. Generate answer (ragService)
  5. Return answer + sources
     ↓
Frontend Displays:
  - AI Answer
  - Source Documents
  - Similarity Scores
```

## 🔧 Configuration

### Backend (.env)
```
MONGODB_URI=mongodb+srv://...
GEMINI_API_KEY=your-api-key
PORT=5000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🐛 Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Backend won't connect | MongoDB not running | Start MongoDB |
| API key error | GEMINI_API_KEY missing | Add to .env |
| Frontend shows warning | Backend not running | Start backend on port 5000 |
| PDF upload fails | Not a PDF file | Use .pdf file |
| Chat has no answers | No documents uploaded | Upload PDF first |
| Slow responses | Embeddings still processing | Wait 30 seconds |

## 📦 Required NPM Packages

### Backend
```
express cors dotenv mongoose pdf-parse @google/generative-ai multer
```

### Frontend
```
next react react-dom
```

All are already installed. Just run `npm install` in each directory.

## 🎓 Architecture Highlights

### RAG Pipeline
```
Question → Embedding → Search → Context Building → AI Generation → Answer
```

### Tech Stack
- **Frontend**: Next.js + React + Tailwind CSS + TypeScript
- **Backend**: Node.js + Express + MongoDB
- **AI**: Google Gemini (embeddings & answer generation)
- **Vector Search**: Cosine similarity on embeddings

### Design Patterns
- Service layer abstraction
- Async/await for non-blocking operations
- Comprehensive error handling
- Environment-based configuration
- Component-based UI

## 📚 Next Steps (Future Enhancements)

- [ ] User authentication
- [ ] Document management (delete, update)
- [ ] Chat history persistence
- [ ] Advanced filtering (by date, document type)
- [ ] Feedback mechanism
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Vector database optimization
- [ ] Streaming responses
- [ ] Document summarization

## 🤝 Development Guidelines

### Adding New Features
1. Backend: Add service/route
2. Frontend: Create component
3. Test API endpoints
4. Update UI/UX
5. Test full workflow

### Code Organization
- Keep services focused and single-purpose
- Use TypeScript for type safety
- Add console.log for debugging
- Handle errors gracefully
- Write meaningful variable names

## 📞 Support & Debugging

### Check Logs
- Frontend: Browser DevTools Console
- Backend: Terminal output
- Backend: Check .env GEMINI_API_KEY

### Debug Mode
```javascript
// In frontend - check network tab
// In backend - add console.log statements
console.log('Processing:', documentId);
```

### API Testing with curl
```bash
# Check health
curl http://localhost:5000/api/health

# Upload document
curl -X POST -F "file=@document.pdf" \
  http://localhost:5000/api/documents/upload

# Ask question
curl -X POST -H "Content-Type: application/json" \
  -d '{"question":"What is..."}' \
  http://localhost:5000/api/chat
```

## 🎉 You're All Set!

Your CollegeAI RAG chatbot is ready to use!

1. ✅ Backend processing PDFs
2. ✅ Frontend displaying chat
3. ✅ AI generating answers
4. ✅ Sources showing relevance

**Start by uploading a sample college document and asking a question!**

---

**Happy Coding! 🚀**

For detailed documentation:
- Backend: See `backend/README.md` (if available)
- Frontend: See `frontend/college-ai/FRONTEND_README.md`
