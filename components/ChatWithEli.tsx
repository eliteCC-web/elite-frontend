"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { getPublicUrl } from '@/lib/utils';

interface ChatWithEliProps {
  className?: string;
}

export function ChatWithEli({ className = "" }: ChatWithEliProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, isLoading, isServiceAvailable, sendMessage } = useChat();

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus en input cuando se abre el chat
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !isServiceAvailable) return;

    const message = inputMessage.trim();
    setInputMessage('');
    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Botón flotante con ícono de mensaje */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-primary-500 hover:bg-primary-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          aria-label="Abrir chat con Eli"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Ventana de chat */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden w-80 h-96 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                {/* Imagen de perfil de Eli - Configurar con tu URL de Supabase */}
                <img 
                  src={getPublicUrl('elitecc-web//oso_Chat.jpg') || "https://via.placeholder.com/40x40/3b82f6/ffffff?text=E"} 
                  alt="Eli Avatar" 
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold">Eli</h3>
                <p className="text-xs text-white/80">Asistente Virtual</p>
                {!isServiceAvailable && (
                  <p className="text-xs text-yellow-200">Servicio no disponible</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMinimize}
                className="text-white/80 hover:text-white transition-colors"
                aria-label={isMinimized ? "Maximizar" : "Minimizar"}
              >
                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </button>
              <button
                onClick={toggleChat}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Cerrar chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Contenido del chat */}
          {!isMinimized && (
            <>
              {/* Mensajes */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${msg.isUser ? 'order-2' : 'order-1'}`}>
                      {!msg.isUser && (
                        <div className="flex items-center gap-2 mb-1">
                          <img 
                            src={getPublicUrl('elitecc-web//oso_Chat.jpg') || "https://via.placeholder.com/24x24/3b82f6/ffffff?text=E"} 
                            alt="Eli" 
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span className="text-xs text-neutral-500">Eli</span>
                        </div>
                      )}
                      <div
                        className={`p-3 rounded-2xl ${
                          msg.isUser
                            ? 'bg-primary-500 text-white rounded-br-md'
                            : 'bg-white text-neutral-900 border border-neutral-200 rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.message}</p>
                        <p className={`text-xs mt-1 ${
                          msg.isUser ? 'text-white/70' : 'text-neutral-400'
                        }`}>
                          {msg.timestamp.toLocaleTimeString('es-ES', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Indicador de carga */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-neutral-200 rounded-2xl rounded-bl-md p-3">
                      <div className="flex items-center gap-2">
                        <img 
                          src={getPublicUrl('elitecc-web//oso_Chat.jpg') || "https://via.placeholder.com/24x24/3b82f6/ffffff?text=E"} 
                          alt="Eli" 
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-xs text-neutral-500">Eli está escribiendo...</span>
                      </div>
                      <div className="flex gap-1 mt-2">
                        <div className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-neutral-200 bg-white">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isServiceAvailable ? "Escribe tu mensaje..." : "Servicio no disponible"}
                    className="flex-1 px-4 py-2 border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm disabled:bg-neutral-100 disabled:text-neutral-500"
                    disabled={isLoading || !isServiceAvailable}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading || !isServiceAvailable}
                    className="bg-primary-500 hover:bg-primary-600 disabled:bg-neutral-300 text-white p-2 rounded-2xl transition-colors duration-200"
                    aria-label="Enviar mensaje"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
} 