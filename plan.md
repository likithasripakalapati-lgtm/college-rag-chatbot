CollegeAI — Implementation Plan

1. Project Setup

Create the main project structure:

college-rag-chatbot/
├── frontend/
├── backend/
├── spec.md
├── plan.md
├── README.md
└── .gitignore

The frontend and backend will be developed separately.

---

2. Phase 1 — Backend Foundation

Step 1: Create Backend

Create a Node.js and Express.js backend.

Tasks:

- Initialize Node.js project.
- Install required dependencies.
- Create Express server.
- Configure environment variables.
- Add health check API.

Expected endpoint:

GET /api/health

Expected response:

{
"status": "Backend is running"
}

---

3. Phase 2 — Database Setup

Step 2: MongoDB Atlas

Tasks:

- Create MongoDB Atlas account/project.
- Create database cluster.
- Create database user.
- Configure network access.
- Get MongoDB connection string.
- Store connection string in backend ".env".

Environment variable:

MONGODB_URI

Tasks in backend:

- Connect Express backend to MongoDB.
- Add database connection error handling.

---

4. Phase 3 — Authentication

Step 3: User Authentication

Create the User model.

Fields:

- name
- email
- password
- role
- createdAt

Roles:

- student
- admin

Features:

- Register student.
- Login.
- JWT authentication.
- Password hashing using bcrypt.
- Protected routes.
- Logout from frontend.

API endpoints:

POST /api/auth/register

POST /api/auth/login

GET /api/auth/me

---

5. Phase 4 — Document Management

Step 4: Admin Document Upload

Create admin-only document management.

Features:

- Upload PDF documents.
- Validate file type.
- Store uploaded files.
- Create document metadata.
- Track processing status.

API:

POST /api/documents/upload

GET /api/documents

DELETE /api/documents/:id

---

6. Phase 5 — Document Processing

Step 5: Extract Text

After uploading a document:

1. Read the document.
2. Extract text.
3. Clean unnecessary formatting.
4. Validate extracted text.

Supported priority:

1. PDF
2. TXT

DOCX can be added later if time permits.

---

7. Phase 6 — Text Chunking

Step 6: Divide Documents into Chunks

The extracted document text will be divided into smaller chunks.

Each chunk stores:

- documentId
- text
- chunkIndex
- metadata

Recommended initial chunk size:

500–1000 characters.

Add overlap between chunks to avoid losing context.

---

8. Phase 7 — Embeddings

Step 7: Generate Embeddings

For every document chunk:

1. Send chunk text to the embedding model.
2. Receive vector embedding.
3. Store embedding with the chunk.

The same embedding model must be used for student questions.

Environment variable:

GEMINI_API_KEY

---

9. Phase 8 — Vector Search

Step 8: Retrieve Relevant Information

When a student asks a question:

1. Generate an embedding for the question.
2. Search stored document embeddings.
3. Find the most similar chunks.
4. Retrieve top relevant chunks.

Initial target:

Top 3 relevant chunks.

---

10. Phase 9 — RAG Answer Generation

Step 9: Generate AI Answer

The RAG system will:

1. Receive student question.
2. Retrieve relevant document chunks.
3. Build context from retrieved chunks.
4. Send question + context to Gemini.
5. Generate final answer.

The AI prompt should instruct the model:

- Answer only using the provided context.
- Do not invent college-specific information.
- Clearly state when information is unavailable.

---

11. Phase 10 — Source Display

Step 10: Show Sources

Each chatbot answer should include:

- Source document name.
- Relevant document reference.

Example:

Source:
Academic Calendar 2026.pdf

---

12. Phase 11 — Chat History

Step 11: Store Conversations

Create Chat model.

Store:

- userId
- question
- answer
- sources
- createdAt

API:

POST /api/chat

GET /api/chat/history

Students can view previous conversations.

---

13. Phase 12 — Frontend Setup

Step 12: Create Next.js Frontend

Create:

- Next.js application.
- Tailwind CSS setup.
- API configuration.
- Responsive layout.

Pages:

- Landing page
- Login
- Register
- Student Chat Dashboard
- Admin Dashboard

---

14. Phase 13 — Frontend Authentication

Step 13: Connect Authentication

Tasks:

- Registration form.
- Login form.
- Store authentication token.
- Protect dashboard routes.
- Logout functionality.
- Show user information.

---

15. Phase 14 — Chat Interface

Step 14: Build Chat UI

Features:

- Chat messages.
- User message bubble.
- AI message bubble.
- Input field.
- Send button.
- Loading indicator.
- Source display.
- Error messages.

---

16. Phase 15 — Admin Dashboard

Step 15: Build Admin Interface

Features:

- Upload documents.
- View uploaded documents.
- Processing status.
- Delete documents.
- Basic statistics.

---

17. Phase 16 — Testing

Step 16: Test Locally

Test:

Authentication

- Registration
- Login
- Logout
- Protected routes

Documents

- Upload
- Processing
- Retrieval
- Delete

RAG

- Ask questions related to uploaded documents.
- Verify relevant chunks are retrieved.
- Verify AI uses document context.
- Test unknown questions.

UI

- Mobile responsiveness.
- Loading states.
- Error handling.
- Empty states.

---

18. Phase 17 — GitHub

Step 17: Prepare Repository

Before pushing:

Create ".gitignore".

Ignore:

node_modules/
.env
.env.local
.next/

Push:

- frontend
- backend
- spec.md
- plan.md
- README.md
- .gitignore

Never push:

- API keys
- MongoDB credentials
- JWT secrets

---

19. Phase 18 — Deployment

Step 18: Deploy Database

Set up MongoDB Atlas.

---

Step 19: Deploy Backend

Deploy Express backend to Render.

Configure:

- Root directory: backend
- Build command: npm install
- Start command: npm start

Add environment variables:

- MONGODB_URI
- JWT_SECRET
- GEMINI_API_KEY
- FRONTEND_URL

---

Step 20: Deploy Frontend

Deploy Next.js frontend to Vercel.

Configure:

NEXT_PUBLIC_API_URL

---

20. Phase 19 — Production Testing

Test the deployed application:

- Registration
- Login
- Logout
- Document upload
- RAG question answering
- Source display
- Chat history
- Database connection
- API requests
- Mobile responsiveness
- Error handling

---

21. Priority Plan for Submission

🔴 Highest Priority

These must work:

1. Document upload.
2. PDF text extraction.
3. Text chunking.
4. Embeddings.
5. Semantic/vector search.
6. RAG answer generation.
7. Source display.
8. Frontend-backend integration.
9. Deployment.

🟠 Important

If time allows:

- Authentication.
- Chat history.
- Admin dashboard.
- Document deletion.

🟢 Bonus

If time allows:

- Suggested questions.
- Multilingual support.
- Feedback buttons.
- Analytics.
- Voice input.

---

22. Development Order

Follow this exact order:

1. Backend setup.
2. Database connection.
3. Document upload.
4. PDF text extraction.
5. Text chunking.
6. Embeddings.
7. Vector search.
8. RAG answer generation.
9. Test backend.
10. Build frontend.
11. Connect frontend to backend.
12. Add authentication.
13. Add chat history.
14. Improve UI.
15. Push to GitHub.
16. Deploy backend to Render.
17. Deploy frontend to Vercel.
18. Final production testing.

---

23. Definition of Done

The project is complete when:

- The frontend works.
- The backend works.
- MongoDB is connected.
- Admin can upload documents.
- Documents are processed.
- Text is chunked.
- Embeddings are generated.
- Semantic search retrieves relevant chunks.
- Gemini generates answers using retrieved context.
- Sources are displayed.
- Unknown questions are handled correctly.
- The application is deployed.
- GitHub repository is complete.
- README documentation is complete.
- No secrets are exposed.