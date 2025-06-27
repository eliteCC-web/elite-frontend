import { useState, useEffect } from 'react';
import { chatService } from '@/services/chat.service';

export interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: Date;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: '¡Hola! Soy Eli, tu asistente virtual de Elite Centro Comercial. ¿En qué puedo ayudarte hoy?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [isServiceAvailable, setIsServiceAvailable] = useState(true);

  // Generar sessionId al montar el hook
  useEffect(() => {
    if (!sessionId) {
      setSessionId(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    }
  }, [sessionId]);

  // Verificar disponibilidad del servicio
  useEffect(() => {
    const checkService = async () => {
      const isAvailable = await chatService.checkHealth();
      console.log('isAvailable', isAvailable);
      setIsServiceAvailable(isAvailable);
    };
    checkService();
  }, []);

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading || !isServiceAvailable) return;

    const userMessage = message.trim();
    
    // Agregar mensaje del usuario
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      message: userMessage,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const data = await chatService.sendMessage(userMessage, sessionId);
      
      // Agregar respuesta de Eli
      const eliMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: data.response,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, eliMsg]);

    } catch (error) {
      console.error('Error enviando mensaje:', error);
      
      // Mensaje de error
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: 'Lo siento, estoy teniendo problemas técnicos. Por favor, intenta de nuevo en unos momentos.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([
      {
        id: '1',
        message: '¡Hola! Soy Eli, tu asistente virtual de Elite Centro Comercial. ¿En qué puedo ayudarte hoy?',
        isUser: false,
        timestamp: new Date()
      }
    ]);
  };

  return {
    messages,
    isLoading,
    isServiceAvailable,
    sendMessage,
    clearMessages,
    sessionId
  };
} 