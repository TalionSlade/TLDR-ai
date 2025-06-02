import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className={`relative border ${disabled ? 'bg-gray-100 border-gray-200' : 'bg-white border-gray-300'} rounded-lg overflow-hidden transition-all duration-200`}>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Upload a document first" : "Ask a question about the document..."}
          className="w-full px-4 py-3 pr-12 max-h-32 resize-none focus:outline-none focus:ring-0 bg-transparent disabled:text-gray-500"
          rows={1}
          disabled={disabled}
        />
        
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className={`absolute right-2 bottom-2 p-2 rounded-full ${
            !message.trim() || disabled
              ? 'text-gray-400 bg-gray-100'
              : 'text-white bg-blue-600 hover:bg-blue-700'
          } transition-colors`}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;