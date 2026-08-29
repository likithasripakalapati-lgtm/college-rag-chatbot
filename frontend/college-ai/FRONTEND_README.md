# CollegeAI Frontend

A modern, responsive Next.js frontend for the CollegeAI RAG (Retrieval-Augmented Generation) chatbot.

## 🚀 Features

- **Student Chat Interface**: Ask questions about college information and get AI-powered answers
- **Admin Document Upload**: Upload PDF documents for the RAG system to process
- **Semantic Search**: Displays relevant document sources with similarity scores
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Connection Status**: Shows backend connectivity status
- **Professional UI**: Modern, clean design with Tailwind CSS

## 🛠️ Technology Stack

- **Framework**: Next.js 16 with App Router
- **UI Framework**: Tailwind CSS 4
- **Language**: TypeScript
- **State Management**: React Hooks
- **API Integration**: Fetch API with proper error handling

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend server running on `http://localhost:5000`

## ⚙️ Setup

### 1. Install Dependencies

```bash
cd frontend/college-ai
npm install
```

### 2. Configure Backend URL

The frontend looks for the backend at `http://localhost:5000` by default.

To change this, edit `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
app/
├── page.tsx           # Main application page
├── layout.tsx         # Root layout with metadata
└── globals.css        # Global styles

components/
├── Header.tsx         # Navigation header
├── ChatInterface.tsx  # Main chat UI component
├── MessageBubble.tsx  # Message display component
└── DocumentUpload.tsx # File upload component

lib/
└── api.ts            # API utility functions

.env.local            # Environment configuration (local development)
.env.local.example    # Example environment file
```

## 🎨 UI Components

### Header
- Displays CollegeAI branding
- Navigation links to chat and upload sections

### Chat Interface
- Message display area with scrolling
- User and AI message bubbles
- Source attribution with similarity scores
- Loading indicators
- Error handling
- Empty state with helpful instructions

### Document Upload
- Drag-and-drop file input
- File validation (PDF only)
- Upload progress indication
- Success/error messages
- File size display

### Message Bubble
- Distinguishes user messages (blue, right-aligned) from AI responses (gray, left-aligned)
- Displays source documents with:
  - Document file name
  - Chunk index
  - Similarity score

## 🔌 API Integration

### Chat Endpoint
```
POST http://localhost:5000/api/chat

Request:
{
  "question": "What are the hostel facilities?"
}

Response:
{
  "success": true,
  "answer": "...",
  "sources": [
    {
      "documentId": "...",
      "fileName": "hostel_info.pdf",
      "chunkIndex": 0,
      "similarity": 0.85
    }
  ]
}
```

### Document Upload Endpoint
```
POST http://localhost:5000/api/documents/upload

FormData:
- file: PDF file

Response:
{
  "success": true,
  "message": "Document uploaded successfully",
  "document": {
    "id": "...",
    "fileName": "...",
    "originalName": "hostel_info.pdf",
    "processingStatus": "uploaded"
  }
}
```

### Health Check
```
GET http://localhost:5000/api/health

Response:
{
  "success": true,
  "message": "CollegeAI backend is running"
}
```

## 🎯 Usage Workflow

1. **Upload Documents**
   - Admin user uploads college PDF documents
   - Backend processes: extraction → chunking → embedding
   - Visible success message confirms upload

2. **Ask Questions**
   - Student types a question in the chat interface
   - Frontend sends question to backend
   - Backend performs semantic search
   - AI generates answer using retrieved context

3. **View Answers**
   - AI response displays in chat
   - Sources shown with document names and similarity scores
   - Student can ask follow-up questions

## 🔒 Security

- No authentication implemented yet (development mode)
- API keys managed server-side
- FormData used for file uploads (no raw file content in JSON)
- Environment variables for API URL configuration

## 🐛 Error Handling

The frontend handles:
- **No backend connection**: Shows warning banner
- **Empty questions**: Displays error message
- **File validation errors**: Only PDF files accepted
- **Upload failures**: Shows detailed error messages
- **API errors**: Graceful error display with user-friendly messages
- **Missing documents**: Prompts user to upload documents first

## 📱 Responsive Design

- **Mobile**: Single column layout, touch-friendly buttons
- **Tablet**: 2-column layout with sidebar
- **Desktop**: Full 3-column layout with admin panel on right

## 🚀 Build for Production

```bash
npm run build
npm start
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000` |

## 🔧 Development Tips

- Hot reload enabled - changes reflect immediately
- TypeScript provides type safety for API responses
- Console logs for debugging API calls
- Network tab shows all API requests
- React DevTools recommended for component debugging

## 📞 Troubleshooting

### Backend Connection Issues
- Ensure backend is running on `http://localhost:5000`
- Check CORS configuration in backend
- Verify `.env.local` has correct API URL

### PDF Upload Not Working
- Ensure file is valid PDF format
- Check file size (max 50MB on backend)
- Verify backend is accepting uploads

### Chat Not Responding
- Check if documents have been uploaded and processed
- Ensure embeddings are completed (check backend logs)
- Verify backend is running

### Styling Issues
- Clear `.next` cache: `rm -rf .next`
- Rebuild: `npm run build`
- Ensure Tailwind CSS is properly installed

## 📚 Further Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🎓 Learning Path

1. Understand the RAG workflow
2. Explore component hierarchy
3. Study API integration patterns
4. Review error handling strategies
5. Extend with custom features

---

**Built with ❤️ for college students**
