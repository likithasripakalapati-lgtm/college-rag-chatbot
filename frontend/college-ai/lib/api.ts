const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// ==================== CHAT ====================

export interface ChatRequest {
  question: string;
}

export interface ChatSource {
  documentId: string;
  fileName: string;
  chunkIndex: number;
  similarity: number;
}

export interface ChatResponse {
  success: boolean;
  answer: string;
  sources: ChatSource[];
  error?: string;
  message?: string;
}

export async function askQuestion(
  question: string
): Promise<ChatResponse> {
  try {
    if (!question.trim()) {
      return {
        success: false,
        answer: '',
        sources: [],
        error: 'Question cannot be empty'
      };
    }

    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question: question.trim()
      })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        answer: '',
        sources: [],
        error:
          data.message ||
          `Error: ${response.status} ${response.statusText}`
      };
    }

    return {
      success: data.success,
      answer: data.answer || '',
      sources: data.sources || [],
      message: data.message
    };
  } catch (error) {
    return {
      success: false,
      answer: '',
      sources: [],
      error:
        error instanceof Error
          ? error.message
          : 'Failed to connect to the server'
    };
  }
}

// ==================== DOCUMENTS ====================

export interface UploadResponse {
  success: boolean;
  message: string;
  document?: {
    id: string;
    fileName: string;
    originalName: string;
    processingStatus: string;
  };
  error?: string;
}

export interface DocumentItem {
  _id: string;
  fileName: string;
  originalName: string;
  fileType: string;
  processingStatus: string;
  createdAt?: string;
  uploadedAt?: string;
}

export interface DocumentsResponse {
  success: boolean;
  documents: DocumentItem[];
  message?: string;
}

// Upload a PDF document
export async function uploadDocument(
  file: File
): Promise<UploadResponse> {
  try {
    if (!file) {
      return {
        success: false,
        message: 'No file selected'
      };
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return {
        success: false,
        message: 'Only PDF files are supported'
      };
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      `${API_URL}/api/documents/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message:
          data.message ||
          `Error: ${response.status} ${response.statusText}`
      };
    }

    return {
      success: data.success,
      message: data.message || 'Document uploaded successfully',
      document: data.document
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to upload document'
    };
  }
}

// Get all uploaded documents
export async function getDocuments(): Promise<DocumentsResponse> {
  try {
    const response = await fetch(`${API_URL}/api/documents`);

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        documents: [],
        message: data.message || 'Failed to fetch documents'
      };
    }

    return {
      success: data.success,
      documents: data.documents || []
    };
  } catch (error) {
    return {
      success: false,
      documents: [],
      message:
        error instanceof Error
          ? error.message
          : 'Failed to fetch documents'
    };
  }
}

// Delete an uploaded document
export async function deleteDocument(
  id: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(
      `${API_URL}/api/documents/${id}`,
      {
        method: 'DELETE'
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to delete document'
      };
    }

    return {
      success: data.success,
      message: data.message || 'Document deleted successfully'
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to delete document'
    };
  }
}

// ==================== AUTHENTICATION ====================

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: AuthUser;
}

// Create a new user account
export async function signup(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Signup failed'
      };
    }

    return {
      success: data.success,
      message: data.message || 'Signup successful',
      token: data.token,
      user: data.user
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Signup failed'
    };
  }
}

// Login an existing user
export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Login failed'
      };
    }

    return {
      success: data.success,
      message: data.message || 'Login successful',
      token: data.token,
      user: data.user
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Login failed'
    };
  }
}

// ==================== HEALTH CHECK ====================

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/health`, {
      method: 'GET'
    });

    return response.ok;
  } catch {
    return false;
  }
}