"# CollegeAI" 
CollegeAI – RAG-Based College Chatbot

Project Name

CollegeAI – RAG-Based College Chatbot

Problem Statement

Students often need information about admissions, courses, fees, examinations, academic policies, hostel facilities, scholarships, placements, and other college-related topics. This information is usually scattered across PDFs, notices, and different documents.

CollegeAI solves this problem by providing an AI-powered chatbot that answers college-related questions using uploaded college documents as its knowledge base.

The application uses a Retrieval-Augmented Generation (RAG) approach to retrieve relevant information from uploaded documents before generating an AI-powered answer.

---

Features

Core Features

- User Signup and Login
- User Authentication
- Logout functionality
- Protected application access
- AI-powered college chatbot
- Chat interface for asking college-related questions
- PDF document upload
- Document processing
- Text extraction from uploaded PDFs
- Document chunking
- Semantic/similarity search
- Retrieval-Augmented Generation (RAG)
- AI-generated answers based on uploaded documents
- Source/reference information for answers
- Knowledge Base for managing documents
- View uploaded documents
- Delete uploaded documents
- New Chat functionality
- Error handling and loading states
- Frontend and backend integration
- Database integration
- Fully deployed application

Additional Features

- Responsive user interface
- Modern ChatGPT-style chat interface
- Backend connection status
- Suggested questions
- AI thinking/loading indicator
- Secure password hashing
- JWT-based authentication

---

Technology Stack

Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

Backend

- Node.js
- Express.js

Database

- MongoDB
- Mongoose

AI and RAG

- Google Generative AI (Gemini)
- Retrieval-Augmented Generation (RAG)
- Document chunking
- Similarity search

Other Technologies

- JWT (JSON Web Tokens)
- bcryptjs
- Multer
- pdf-parse
- CORS
- dotenv

Deployment

- Frontend: Vercel
- Backend: Render
- Source Code: GitHub

---

RAG Architecture

The application follows this Retrieval-Augmented Generation workflow:

College PDF Documents
↓
Text Extraction
↓
Document Chunking
↓
Embedding / Semantic Representation
↓
Similarity Search
↓
Relevant Context Retrieval
↓
Google Gemini AI
↓
AI-Generated Answer with Sources

This ensures that CollegeAI uses the uploaded knowledge base to answer relevant college-related questions.

---

Application Architecture

User
  ↓
Next.js Frontend (Vercel)
  ↓
Express.js Backend (Render)
  ↓
MongoDB Database
  ↓
Document Processing + RAG Pipeline
  ↓
Google Gemini AI

---

Screenshots

Add screenshots of the following screens here:

- Sign In Page
- Create Account Page
- CollegeAI Chat Interface
- Knowledge Base
- PDF Upload
- Uploaded Documents List
- AI-generated Answer with Source

Example:

screenshots/
├── login.png
├── signup.png
├── chat.png
├── knowledge-base.png
└── document-upload.png

---

Live Demo

Frontend:

https://collegeai-six.vercel.app

Backend API:

https://college-ai-backend-tbmg.onrender.com

Backend Health Check:

https://college-ai-backend-tbmg.onrender.com/api/health

---

Setup Instructions

1. Clone the Repository

git clone <your-github-repository-url>

2. Install Backend Dependencies

cd backend
npm install

3. Configure Backend Environment Variables

Create a ".env" file inside the backend folder and add the required environment variables.

4. Start the Backend

npm start

5. Install Frontend Dependencies

Open another terminal:

cd frontend/college-ai
npm install

6. Configure Frontend Environment Variables

Create a ".env.local" file inside the frontend folder.

7. Start the Frontend

npm run dev

Open:

http://localhost:3000

---

Environment Variables

Backend

PORT
MONGODB_URI
JWT_SECRET
GEMINI_API_KEY

Frontend

NEXT_PUBLIC_API_URL

⚠️ Do not commit ".env" files, API keys, passwords, JWT secrets, or other private credentials to GitHub.

---

Authentication

CollegeAI includes user authentication using:

- User Signup
- User Login
- Password Hashing using bcryptjs
- JWT Authentication
- Logout functionality

---

Document Management

Users can manage the CollegeAI knowledge base by:

- Uploading PDF documents
- Processing documents
- Viewing uploaded documents
- Deleting documents

The uploaded documents are used by the RAG pipeline to provide relevant answers.

---

Deployment

The project is deployed using the following architecture:

GitHub
  │
  ├── Vercel
  │     ↓
  │  Next.js Frontend
  │
  └── Render
        ↓
    Express Backend
        ↓
     MongoDB

---

Project Status

✅ Frontend deployed
✅ Backend deployed
✅ Database connected
✅ User authentication working
✅ PDF upload working
✅ Document management working
✅ AI chatbot working
✅ RAG-based question answering working

---

Author

Likitha Sri

---

Project Purpose

This project was built as a full-stack AI-powered application to demonstrate:

- Frontend development
- Backend API development
- Database integration
- Authentication
- Document processing
- Retrieval-Augmented Generation (RAG)
- AI integration
- Deployment
- Full-stack application architecture