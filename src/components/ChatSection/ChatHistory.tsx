import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import { Message } from '../../context/ChatContext';
import { usePDF } from '../../context/PDFContext';

interface ChatHistoryProps {
  messages: Message[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { pdfFile } = usePDF();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-grow overflow-y-auto p-4">
      {messages.length === 0 && pdfFile && (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <span className="text-blue-500 text-2xl">?</span>
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-1">Ask anything about the document</h3>
          <p className="text-sm text-gray-500 max-w-sm">
            Try asking about refund policies, cancellation terms, or data usage
          </p>
        </div>
      )}
      
      {!pdfFile && messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <span className="text-gray-500 text-2xl">!</span>
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-1">No document uploaded</h3>
          <p className="text-sm text-gray-500 max-w-sm">
            Upload a Terms & Conditions document to start asking questions
          </p>
        </div>
      )}
      
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatHistory;