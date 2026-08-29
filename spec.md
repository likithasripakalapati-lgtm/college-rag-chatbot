CollegeAI — RAG-Based College Information Chatbot

1. Project Overview

CollegeAI is an AI-powered college information assistant that helps students quickly find accurate information about their college.

Students can ask questions related to admissions, departments, courses, fees, examinations, academic calendars, hostels, libraries, placements, scholarships, college policies, events, and other college-related topics.

Instead of answering questions using only general AI knowledge, the application uses a Retrieval-Augmented Generation (RAG) pipeline. The system retrieves relevant information from uploaded college documents before generating an answer.

The chatbot displays the answer along with the source document used to generate the response.

---

2. Problem Statement

College students often need information from multiple documents, notices, PDFs, and college resources. Finding the correct information manually can be time-consuming and confusing.

Important information may be spread across admission documents, academic calendars, examination notices, hostel documents, placement information, and other college resources.

CollegeAI solves this problem by providing a centralized AI-powered chatbot that searches uploaded college documents and answers student questions based on the available knowledge base.

---

3. Project Goals

The application should

- Allow students to ask college-related questions.
- Retrieve relevant information from uploaded documents.
- Generate answers using an AI model and retrieved context.
- Display the source of the information used.
- Clearly handle questions for which no relevant information is available.
- Allow administrators to manage the knowledge base.
- Store application data and chat history in a database.
- Provide a responsive and user-friendly interface.

---

4. User Roles

Student

Students can

- Register and log in.
- Ask college-related questions.
- View AI-generated answers.
- View the source document used for an answer.
- View previous chat history.
- Log out.

Admin

Administrators can

- Log in securely.
- Upload college documents.
- View uploaded documents.
- Delete documents.
- Manage the chatbot knowledge base.
- View basic document statistics.

---

5. Core Features

5.1 User Authentication

The system must provide

- Student registration.
- Student login.
- Admin login.
- Logout functionality.
- Protected routespages.
- Secure password handling.
- JWT-based authentication.

---

5.2 Chat Interface

The application must provide a modern chat interface where users can

- Type questions.
- Send questions to the chatbot.
- View AI-generated answers.
- View loading states while answers are generated.
- View error messages when requests fail.
- View previous conversation messages.

Example questions

- What courses are available
- What is the hostel fee
- When are the semester examinations
- What are the library timings
- What placement opportunities are available

---

6. Required RAG Pipeline

The application must implement a real Retrieval-Augmented Generation pipeline.

The workflow is

College Documents
        ↓
Document Upload
        ↓
Text Extraction
        ↓
Text Cleaning
        ↓
Text Chunking
        ↓
Embedding Generation
        ↓
Vector Database Storage
        ↓
Student Question
        ↓
Question Embedding
        ↓
Similarity Search
        ↓
Relevant Document Chunks
        ↓
AI Model
        ↓
Final Answer
        ↓
Answer + Source Display

---

6.1 Document Upload

Administrators can upload college-related documents.

Supported document types may include

- PDF
- TXT
- DOCX

Each uploaded document should store

- Document name
- File type
- Upload date
- Uploaded by
- Processing status

---

6.2 Text Extraction

The backend extracts text from uploaded documents.

For PDF files, the system extracts readable text from the PDF.

The extracted text is prepared for further processing.

---

6.3 Text Chunking

Large documents must be divided into smaller text chunks.

Each chunk should contain

- Chunk text
- Document reference
- Chunk index
- Metadata

Chunking allows the system to search documents efficiently.

---

6.4 Embedding Generation

The application generates vector embeddings for document chunks.

Embeddings represent the semantic meaning of text.

The same embedding model should be used for

- Document chunks
- Student questions

---

6.5 Vector Search

When a student asks a question

1. Generate an embedding for the question.
2. Search the vector database.
3. Find the most semantically relevant document chunks.
4. Retrieve the top matching results.

The retrieved chunks become the context for the AI model.

---

6.6 AI Answer Generation

The application sends the following to the AI model

- Student question.
- Relevant retrieved document context.

The AI model must answer based primarily on the retrieved context.

The system should not invent college-specific information.

If sufficient information is not available, the chatbot should clearly state that the answer could not be found in the available college documents.

---

7. Unknown Question Handling

If no relevant document information is found, the chatbot should respond with a message similar to

«I could not find reliable information about this question in the available college documents. Please contact the appropriate college department or administrator.»

The application should avoid hallucinating college-specific information.

---

8. Source and Reference Display

Every answer generated from retrieved information should display relevant source information.

The source display should include

- Document name.
- Relevant sourcereference.

Example

Source
Academic Calendar 2026.pdf

---

9. Chat History

The application should store previous conversations.

Each chat message should include

- User ID.
- User question.
- AI answer.
- Source information.
- Timestamp.

Students should be able to view previous chat conversations.

---

10. Admin Document Management

The Admin Dashboard should allow administrators to

- Upload documents.
- View uploaded documents.
- View processing status.
- Delete documents.
- View the number of documents in the knowledge base.

When a document is deleted, its associated vector chunks should also be removed.

---

11. Frontend Pages

11.1 Landing Page

The landing page should include

- Project name and branding.
- Short description.
- Explanation of how the chatbot works.
- Login button.
- Sign-up button.
- Call-to-action to start chatting.

---

11.2 Login Page

Features

- Email input.
- Password input.
- Login button.
- Error handling.
- Link to registration.

---

11.3 Registration Page

Features

- Name.
- Email.
- Password.
- Account creation.
- Validation.
- Error messages.

---

11.4 Student Chat Dashboard

Features

- Chat interface.
- Message input.
- Send button.
- AI responses.
- Loading indicator.
- Source display.
- Suggested questions.
- Chat history.

---

11.5 Admin Dashboard

Features

- Document upload.
- Uploaded document list.
- Processing status.
- Delete document functionality.
- Basic statistics.

---

12. Backend Architecture

The backend will be built using Node.js and Express.js.

Main backend modules

backend
│
├── config
│   └── database.js
│
├── controllers
│   ├── authController.js
│   ├── chatController.js
│   └── documentController.js
│
├── middleware
│   └── authMiddleware.js
│
├── models
│   ├── User.js
│   ├── Document.js
│   ├── DocumentChunk.js
│   └── Chat.js
│
├── routes
│   ├── authRoutes.js
│   ├── chatRoutes.js
│   └── documentRoutes.js
│
├── services
│   ├── embeddingService.js
│   ├── ragService.js
│   └── aiService.js
│
├── uploads
│
├── server.js
└── package.json

---

13. Database Design

13.1 Users Collection

User
├── name
├── email
├── password
├── role
└── createdAt

Roles

- student
- admin

---

13.2 Documents Collection

Document
├── fileName
├── fileType
├── uploadedBy
├── uploadDate
├── processingStatus
└── createdAt

---

13.3 Document Chunks Collection

DocumentChunk
├── documentId
├── text
├── chunkIndex
├── embedding
└── metadata

The embedding field is used for semanticvector search.

---

13.4 Chats Collection

Chat
├── userId
├── question
├── answer
├── sources
└── createdAt

---

14. API Endpoints

Authentication

POST apiauthregister
POST apiauthlogin
GET  apiauthme

---

Documents

POST   apidocumentsupload
GET    apidocuments
DELETE apidocumentsid

---

Chat

POST apichat
GET  apichathistory

---

Health Check

GET apihealth

This endpoint should confirm that the backend is running.

---

15. Technology Stack

Frontend

- Next.js
- React
- Tailwind CSS

Backend

- Node.js
- Express.js

Database

- MongoDB Atlas

Authentication

- JWT
- bcrypt

Document Processing

- PDF text extraction library
- DOCX processing library where applicable

AI and Embeddings

- Gemini API or another suitable AIembedding service

Vector Search

- MongoDB Atlas Vector Search or another compatible vector database

File Upload

- Multer or equivalent backend upload middleware

---

16. Environment Variables

Backend

PORT
MONGODB_URI
JWT_SECRET
GEMINI_API_KEY
FRONTEND_URL

Frontend

NEXT_PUBLIC_API_URL

No secret values should be committed to GitHub.

---

17. Error Handling

The application should handle

- Invalid login credentials.
- Invalid form inputs.
- Missing required fields.
- Unauthorized access.
- File upload errors.
- Unsupported file types.
- Document processing failures.
- Database connection errors.
- AI API failures.
- No relevant information found.
- APInetwork failures.

The frontend should show user-friendly error messages.

---

18. Loading and Empty States

The frontend should include

- Loading indicators while AI responses are generated.
- Loading states while documents are uploaded.
- Empty state when no documents exist.
- Empty state when no chat history exists.
- Clear feedback after successful operations.

---

19. Security Requirements

The application must

- Hash user passwords using bcrypt.
- Use JWT for authentication.
- Protect admin-only routes.
- Protect student dashboard routes.
- Store secrets in environment variables.
- Never expose database passwords or API keys in frontend code.
- Never commit .env files to GitHub.
- Validate user input.
- Restrict file upload types and sizes where possible.

---

20. Deployment Architecture

                     USER
                       │
                       ▼
              ┌─────────────────┐
              │     VERCEL      │
              │    Frontend     │
              │    Next.js      │
              └────────┬────────┘
                       │
                    REST API
                       │
                       ▼
              ┌─────────────────┐
              │     RENDER      │
              │     Backend     │
              │ Node.jsExpress │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │  MONGODB ATLAS  │
              │ Database + RAG  │
              └─────────────────┘
                       │
                       ▼
                AI  Embedding
                    Service

---

21. GitHub Repository Structure

college-rag-chatbot
│
├── frontend
├── backend
├── README.md
├── spec.md
└── .gitignore

The .gitignore must include

node_modules
.env
.env.local
.env..local
.next

---

22. Acceptance Criteria

The project will be considered complete when

- Users can register and log in.
- Protected pages work correctly.
- Admin can upload college documents.
- Documents are processed successfully.
- Document text is chunked.
- Embeddings are generated.
- Embeddings are stored in a vector-searchable database.
- Students can ask college-related questions.
- Relevant document chunks are retrieved.
- The AI generates answers using retrieved context.
- Sources are displayed with answers.
- Unknown questions are handled correctly.
- Chat history is stored and displayed.
- Admin can manage uploaded documents.
- Frontend and backend communicate correctly.
- Database operations work correctly.
- Error handling is implemented.
- The application is responsive.
- The frontend is deployed on Vercel.
- The backend is deployed on Render.
- The database is hosted online.
- The GitHub repository does not expose secrets.

---

23. Future  Bonus Features

Possible bonus features include

- Multilingual chatbot.
- Voice input.
- Voice responses.
- Answer feedback using 👍  👎.
- Suggested questions.
- Department-wise knowledge bases.
- Document relevance score.
- Source highlighting.
- Admin analytics.
- AI-generated FAQs.
- OCR support for scanned PDFs.
- Hybrid keyword and semantic search.
- Document re-ranking.
- Conversation export.
- Role-based access improvements.

---

24. Final Project Summary

CollegeAI is a full-stack RAG-based college information chatbot.

The system allows administrators to build a knowledge base by uploading college documents. These documents are processed, divided into chunks, converted into embeddings, and stored for semantic search.

When students ask questions, the system retrieves the most relevant information from the knowledge base and provides that information to an AI model to generate an accurate response.

The chatbot displays the generated answer along with relevant source information and clearly handles questions that cannot be answered using the available documents.