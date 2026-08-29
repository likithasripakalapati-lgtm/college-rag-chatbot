const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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

/**
 * Send a question to the CollegeAI chat API
 */
export async function askQuestion(question: string): Promise<ChatResponse> {
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
      body: JSON.stringify({ question: question.trim() })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        answer: '',
        sources: [],
        error: errorData.message || `Error: ${response.status} ${response.statusText}`
      };
    }

    const data = await response.json();
    return {
      success: data.success,
      answer: data.answer || '',
      sources: data.sources || [],
      error: undefined
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to connect to the server';
    return {
      success: false,
      answer: '',
      sources: [],
      error: errorMessage
    };
  }
}

/**
 * Upload a PDF document to the backend
 */
export async function uploadDocument(file: File): Promise<UploadResponse> {
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

    const response = await fetch(`${API_URL}/api/documents/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || `Error: ${response.status} ${response.statusText}`
      };
    }

    const data = await response.json();
    return {
      success: data.success,
      message: data.message || 'Document uploaded successfully',
      document: data.document
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload document';
    return {
      success: false,
      message: errorMessage
    };
  }
}

/**
 * Check backend health
 */
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
