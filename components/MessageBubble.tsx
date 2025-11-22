
import React from 'react';
import { Message } from '../types';
import { Bot, User, ShieldCheck, Copy, Check } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

const FormatText: React.FC<{ content: string }> = ({ content }) => {
  const parts = content.split(/(\*\*.*?\*\*)/g);
  return (
    <span className="whitespace-pre-wrap">
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={index} className="font-bold text-inherit">{part.slice(2, -2)}</strong>;
        }
        return part;
      })}
    </span>
  );
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} group animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`
            w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 shadow-sm border
            ${isUser 
                ? 'bg-kognia-dark text-white border-kognia-dark' 
                : 'bg-white text-kognia-blue border-gray-100'
            }
        `}>
            {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-end gap-2">
                <div className={`
                    px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm relative
                    ${isUser 
                        ? 'bg-kognia-dark text-white rounded-tr-none' 
                        : 'bg-gray-50 text-gray-800 border border-gray-100 rounded-tl-none'
                    }
                `}>
                    {message.isTyping ? (
                        <div className="flex gap-1.5 items-center h-5 px-1">
                            <span className="w-1.5 h-1.5 bg-kognia-pink rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1.5 h-1.5 bg-kognia-purple rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1.5 h-1.5 bg-kognia-blue rounded-full animate-bounce"></span>
                        </div>
                    ) : (
                        <FormatText content={message.content} />
                    )}
                </div>
                
                {!message.isTyping && (
                    <button 
                        onClick={handleCopy}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                        title="Copiar"
                    >
                        {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                    </button>
                )}
            </div>

            {/* Footer */}
            {!isUser && !message.isTyping && (
                <div className="flex flex-col gap-2 mt-1 pl-1">
                    {message.citations && message.citations.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-1">
                            {message.citations.map((cite, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 bg-white border border-indigo-100 px-2.5 py-1 rounded-md text-xs text-indigo-600 font-semibold shadow-sm">
                                    <ShieldCheck size={12} className="text-kognia-blue" />
                                    <span className="truncate max-w-[200px]">{cite}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
