/**
 * Real RAG Service - Backend API Integration
 * Replaces mockRagService.ts with actual API calls
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface ApiReference {
  page: number;
  section: string;
  text: string;
}

export interface ChatApiResponse {
  content: string;
  references: ApiReference[];
  model: string;
  provider: string;
}

export interface UploadApiResponse {
  session_id: string;
  filename: string;
  total_pages: number;
  total_chunks: number;
  message: string;
}

export interface HealthResponse {
  status: string;
  llm_provider: string;
  model: string;
  vector_store: string;
  embedding_model: string;
}

/**
 * Upload PDF to backend for processing
 */
export async function uploadPDF(file: File): Promise<UploadApiResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to upload PDF');
  }

  return response.json();
}

/**
 * Send chat message to backend and get RAG response
 */
export async function sendChatMessage(
  question: string,
  sessionId: string,
  temperature: number = 0.7
): Promise<ChatApiResponse> {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      question,
      session_id: sessionId,
      temperature,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to get response');
  }

  return response.json();
}

/**
 * Check backend health and configuration
 */
export async function checkHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`);

  if (!response.ok) {
    throw new Error('Backend health check failed');
  }

  return response.json();
}

/**
 * Delete a session
 */
export async function deleteSession(sessionId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/session/${sessionId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to delete session');
  }
}

/**
 * Get all active sessions
 */
export async function getSessions(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/sessions`);

  if (!response.ok) {
    throw new Error('Failed to fetch sessions');
  }

  return response.json();
}

// Keep FAQ list for UI convenience
export const commonFAQs = [
  {
    id: 1,
    question: "What is the refund policy?",
    category: "Billing"
  },
  {
    id: 2,
    question: "How can I cancel my account?",
    category: "Account"
  },
  {
    id: 3,
    question: "What data do you collect?",
    category: "Privacy"
  },
  {
    id: 4,
    question: "What are the payment terms?",
    category: "Billing"
  },
  {
    id: 5,
    question: "How do you handle disputes?",
    category: "Legal"
  },
  {
    id: 6,
    question: "What are the limitations of liability?",
    category: "Legal"
  },
  {
    id: 7,
    question: "Who owns the intellectual property?",
    category: "Legal"
  }
];
