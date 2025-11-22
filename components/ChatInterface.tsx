
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, StopCircle, Eraser, ArrowUp } from 'lucide-react';
import { Message, UploadedFile } from '../types';
import { MessageBubble } from './MessageBubble';
import { generateResponse } from '../services/aiService';
import { SUGGESTED_PROMPTS } from '../constants';

interface ChatInterfaceProps {
  files: UploadedFile[];
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ files }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const readyFilesCount = files.filter(f => f.status === 'ready').length;

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
    }
  };

  const handleSend = async (text: string = inputValue) => {
    if (!text.trim() || isProcessing) return;

    const userText = text;
    setInputValue('');
    setIsProcessing(true);

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newUserMsg]);

    const typingMsgId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      {
        id: typingMsgId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isTyping: true,
      },
    ]);

    try {
      const response = await generateResponse(messages, userText, files);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === typingMsgId
            ? {
                ...msg,
                content: response.text,
                isTyping: false,
                citations: response.citations,
              }
            : msg
        )
      );
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === typingMsgId
            ? {
                ...msg,
                content: "Lo siento, hubo un error procesando tu solicitud. Por favor verifica tu conexión.",
                isTyping: false,
              }
            : msg
        )
      );
    } finally {
      setIsProcessing(false);
      if (window.innerWidth > 768) {
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setInputValue('');
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-100 bg-white flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${readyFilesCount > 0 ? 'bg-kognia-pink animate-pulse' : 'bg-gray-300'}`}></div>
          <div>
             <h3 className="font-heading font-bold text-gray-900 text-sm">Kognia AI</h3>
             <p className="text-xs text-gray-500 font-medium">
                 {readyFilesCount > 0 ? `Analizando ${readyFilesCount} documento(s)` : 'Modo General Purpose'}
             </p>
          </div>
        </div>
        {messages.length > 0 && (
            <button 
                onClick={clearChat}
                className="text-xs font-semibold text-gray-400 hover:text-kognia-pink flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-pink-50 transition-colors"
            >
                <Eraser size={14} /> Reiniciar
            </button>
        )}
      </div>

      {/* Messages Area */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 md:p-6 bg-white scroll-smooth"
      >
        {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-gradient-to-br from-kognia-pink/10 to-kognia-blue/10 rounded-2xl flex items-center justify-center mb-6 text-transparent bg-clip-text bg-brand-gradient">
                    <Sparkles size={32} className="text-kognia-purple" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-gray-900 mb-2">Hola, soy Kognia AI.</h3>
                <p className="text-gray-500 max-w-md text-sm mb-10 leading-relaxed">
                    Tu agente cognitivo personal. Sube documentación para que pueda razonar sobre ella, o hazme preguntas sobre nuestras soluciones.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                    {SUGGESTED_PROMPTS.map((prompt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSend(prompt)}
                            className="text-left text-xs md:text-sm p-4 bg-white border border-gray-200 rounded-xl hover:border-kognia-purple hover:shadow-lg hover:shadow-kognia-purple/10 transition-all text-gray-600 hover:text-kognia-dark font-medium group"
                        >
                            <span className="group-hover:text-kognia-blue transition-colors">{prompt}</span>
                        </button>
                    ))}
                </div>
            </div>
        ) : (
            <div className="space-y-6">
                {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
                ))}
                <div ref={messagesEndRef} className="h-4" />
            </div>
        )}
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={() => scrollToBottom()}
          className="absolute bottom-28 lg:bottom-24 right-6 p-2 bg-white shadow-lg border border-gray-100 rounded-full text-gray-500 hover:text-kognia-blue transition-all z-20"
        >
          <ArrowUp size={20} />
        </button>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100 relative z-20 mb-16 lg:mb-0">
        <div className="relative flex items-center gap-3">
          <div className="flex-1 relative group">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={readyFilesCount > 0 ? "Pregunta sobre los documentos..." : "Escribe tu consulta a Kognia..."}
              disabled={isProcessing}
              className="w-full pl-5 pr-12 py-4 bg-gray-50 border-gray-200 border rounded-xl focus:outline-none focus:ring-2 focus:ring-kognia-blue/20 focus:border-kognia-blue transition-all text-sm text-gray-800 group-hover:bg-white"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                {isProcessing && (
                    <span className="text-xs animate-pulse text-kognia-blue font-bold">Procesando...</span>
                )}
            </div>
          </div>

          <button
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isProcessing}
            className={`
              h-[54px] w-[54px] flex items-center justify-center rounded-xl transition-all duration-300 shadow-md
              ${
                !inputValue.trim() || isProcessing
                  ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  : 'bg-brand-gradient hover:bg-brand-gradient-hover text-white shadow-kognia-pink/25 hover:scale-105 active:scale-95'
              }
            `}
          >
            {isProcessing ? <StopCircle size={22} className="animate-pulse" /> : <Send size={22} className="ml-0.5" />}
          </button>
        </div>
        <div className="flex justify-center mt-3">
             <p className="text-[10px] text-gray-400 font-medium text-center">
                Kognia AI puede cometer errores.
            </p>
        </div>
      </div>
    </div>
  );
};
