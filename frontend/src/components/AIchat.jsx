/**
 * AIChat - A floating AI assistant chat component that provides an intelligent interface
 * for users to interact with DoBot, a task management assistant.
 * 
 * @component
 * @description This component renders a floating chat button that opens a chat panel
 * where users can send messages to an AI assistant and receive responses. It includes
 * features like typing indicators, quick actions, message formatting, and error handling.
 * 
 * @features
 * - Floating toggle button with gradient styling
 * - Collapsible chat panel with smooth animations
 * - Real-time messaging with typing indicators
 * - Quick action buttons for common queries
 * - Message formatting with markdown-like bold text support
 * - Auto-scroll to latest messages
 * - Error handling with user-friendly messages
 * - Responsive design with Tailwind CSS
 * - Auto-focus on input when chat opens
 * - Keyboard support (Enter to send)
 * 
 * @dependencies
 * - React hooks: useState, useRef, useEffect
 * - chatService: sendChatMessage function for API communication
 * - Tailwind CSS for styling
 * 
 * @returns {JSX.Element} The rendered AIChat component with floating button and chat panel
 */
import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/chatService';



const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await sendChatMessage(inputMessage);
      
      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: response.message || response.response || 'Lo siento, no pude procesar tu solicitud.',
          timestamp: new Date(),
          suggestions: response.suggestions || [],
          stats: response.stats || null
        };

        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Hubo un error al conectar con el asistente. Verifica que N8N esté funcionando.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessage = (content) => {
    return content.split('\n').map((line, i) => (
      <div key={i} className={line.startsWith('•') ? 'ml-4' : ''}>
        {line.includes('**') ? (
          <span dangerouslySetInnerHTML={{
            __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          }} />
        ) : (
          line
        )}
      </div>
    ));
  };

  const quickActions = [
    { text: '¿Qué tareas están bloqueadas?', icon: '🚫' },
    { text: 'Crear una nueva tarea', icon: '✨' },
    { text: 'Mostrar mi progreso', icon: '📊' },
    { text: '¿Quién tiene más tareas pendientes?', icon: '👥' }
  ];

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full transition-all duration-300 shadow-lg ${
          isOpen 
            ? 'bg-red-600 hover:bg-red-700' 
            : 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700'
        }`}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Panel de chat */}
      <div className={`fixed bottom-24 right-6 w-96 h-96 bg-slate-800 rounded-lg shadow-2xl transition-all duration-300 z-40 ${
        isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-slate-700 rounded-t-lg bg-gradient-to-r from-cyan-600 to-purple-600">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              🤖
            </div>
            <div>
              <h3 className="text-white font-semibold">DoBot Assistant</h3>
              <p className="text-cyan-100 text-xs">Tu asistente inteligente</p>
            </div>
          </div>
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 h-64">
          {messages.length === 0 && (
            <div className="text-center text-slate-400 mt-8">
              <div className="text-4xl mb-2">👋</div>
              <p>¡Hola! Soy DoBot, tu asistente de tareas.</p>
              <p className="text-sm mt-2">Pregúntame cualquier cosa sobre tu proyecto.</p>
            </div>
          )}

          {messages.map(message => (
            <div key={message.id} className={`mb-4 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block max-w-xs p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                  : message.isError
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-700 text-slate-100'
              }`}>
                <div className="text-sm">
                  {formatMessage(message.content)}
                </div>
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {message.suggestions.map((suggestion, i) => (
                      <div key={i} className="text-xs text-slate-300 bg-slate-600 px-2 py-1 rounded">
                        💡 {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="mb-4 text-left">
              <div className="inline-block bg-slate-700 text-slate-100 p-3 rounded-lg">
                <div className="flex items-center gap-1">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-xs text-slate-400 ml-2">DoBot está escribiendo...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-700">
          {messages.length === 0 && (
            <div className="mb-3 flex flex-wrap gap-1">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => setInputMessage(action.text)}
                  className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-2 py-1 rounded transition-colors"
                >
                  {action.icon} {action.text}
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              className="flex-1 bg-slate-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-all"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIChat;