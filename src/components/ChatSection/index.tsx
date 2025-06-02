import React from 'react';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import FAQDropdown from './FAQDropdown';
import { useChat } from '../../context/ChatContext';
import { usePDF } from '../../context/PDFContext';

const ChatSection: React.FC = () => {
  const { messages, askQuestion, isProcessing } = useChat();
  const { pdfFile } = usePDF();

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-800">Ask about this document</h2>
        <p className="text-sm text-gray-500">
          {pdfFile 
            ? "Ask any question about the Terms & Conditions document" 
            : "Upload a document to start asking questions"}
        </p>
      </div>
      
      <div className="flex-grow overflow-hidden flex flex-col">
        <ChatHistory messages={messages} />
        
        <div className="p-4 border-t border-gray-200">
          <ChatInput 
            onSendMessage={askQuestion}
            disabled={!pdfFile || isProcessing} 
          />
          <FAQDropdown onSelectQuestion={askQuestion} disabled={!pdfFile} />
        </div>
      </div>
    </div>
  );
};

export default ChatSection;