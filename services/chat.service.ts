// services/chat.service.ts

export interface ChatMessage {
  message: string;
  session_id: string;
}

export interface ChatResponse {
  response: string;
  session_id: string;
}

export interface ChatHistoryResponse {
  messages: Array<{
    id: number;
    message: string;
    is_user: boolean;
    session_id: string;
    created_at: string;
  }>;
}

export class ChatService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_CHAT_URL || '';
    if (!this.baseUrl) {
      console.warn('NEXT_PUBLIC_API_CHAT_URL no está configurada');
    }
  }

  async sendMessage(message: string, sessionId: string): Promise<ChatResponse> {
    if (!this.baseUrl) {
      throw new Error('API Chat URL no configurada');
    }

    const response = await fetch(`${this.baseUrl}/api/chat/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        session_id: sessionId
      }),
    });

    if (!response.ok) {
      throw new Error(`Error en la respuesta del servidor: ${response.status}`);
    }

    return response.json();
  }

  async getChatHistory(sessionId: string): Promise<ChatHistoryResponse> {
    if (!this.baseUrl) {
      throw new Error('API Chat URL no configurada');
    }

    const response = await fetch(`${this.baseUrl}/api/chat/history?session_id=${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error obteniendo historial: ${response.status}`);
    }

    return response.json();
  }

  async saveFeedback(messageId: number, feedback: 'positive' | 'negative'): Promise<void> {
    if (!this.baseUrl) {
      throw new Error('API Chat URL no configurada');
    }

    const response = await fetch(`${this.baseUrl}/api/chat/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message_id: messageId,
        feedback
      }),
    });

    if (!response.ok) {
      throw new Error(`Error guardando feedback: ${response.status}`);
    }
  }

  async checkHealth(): Promise<boolean> {
    if (!this.baseUrl) {
      return false;
    }

    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Error checking chat service health:', error);
      return false;
    }
  }
}

// Instancia singleton
export const chatService = new ChatService(); 