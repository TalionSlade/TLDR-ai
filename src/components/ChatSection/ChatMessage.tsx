import React from 'react';
import { Message } from '../../context/ChatContext';
import { Clock, Copy, User, Bot, FileText } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { text, sender, timestamp, isLoading, references } = message;
  
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div 
      className={`mb-4 flex ${
        sender === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      <div 
        className={`max-w-[85%] md:max-w-[75%] rounded-lg p-3 ${
          sender === 'user'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        <div className="flex items-center mb-1">
          {sender === 'user' ? (
            <User className="h-4 w-4 mr-1.5" />
          ) : (
            <Bot className="h-4 w-4 mr-1.5" />
          )}
          
          <span className={`text-xs ${sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
            {sender === 'user' ? 'You' : 'AI Assistant'}
          </span>
          
          <div className="flex items-center ml-auto">
            <Clock className={`h-3 w-3 mr-1 ${sender === 'user' ? 'text-blue-200' : 'text-gray-400'}`} />
            <span className={`text-xs ${sender === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
              {formatTime(timestamp)}
            </span>
          </div>
        </div>
        
        <div className="whitespace-pre-wrap">
          {isLoading ? (
            <div className="flex items-center">
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 rounded-full bg-current animate-bounce\" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          ) : (
            text
          )}
        </div>
        
        {references && references.length > 0 && (
          <div className="mt-3 pt-2 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-1">References:</div>
            {references.map((ref, index) => (
              <div key={index} className="flex items-center text-xs text-gray-600 mb-1">
                <FileText className="h-3 w-3 mr-1" />
                <span>
                  {ref.section} (Page {ref.page})
                </span>
              </div>
            ))}
          </div>
        )}
        
        {!isLoading && sender === 'ai' && (
          <div className="mt-1 flex justify-end">
            <button
              onClick={handleCopyMessage}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors"
              title="Copy response"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;