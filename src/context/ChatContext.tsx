import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { usePDF } from './PDFContext';
import { generateMockResponse } from '../utils/mockRagResponses';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isLoading?: boolean;
  references?: {
    section: string;
    page: number;
  }[];
}

interface ChatContextType {
  messages: Message[];
  addMessage: (text: string, sender: 'user' | 'ai') => void;
  clearChat: () => void;
  isProcessing: boolean;
  askQuestion: (question: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { pdfFile } = usePDF();

  // Clear chat when PDF changes
  useEffect(() => {
    clearChat();
  }, [pdfFile]);

  const addMessage = (text: string, sender: 'user' | 'ai') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const updateMessage = (id: string, updates: Partial<Message>) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, ...updates } : msg))
    );
  };

  const clearChat = () => {
    setMessages([]);
  };

  const askQuestion = async (question: string) => {
    if (!question.trim()) return;
    
    // Add user question
    addMessage(question, 'user');
    
    // Add loading message from AI
    const loadingMsgId = Date.now().toString();
    setMessages((prev) => [
      ...prev, 
      { 
        id: loadingMsgId, 
        text: '...', 
        sender: 'ai', 
        timestamp: new Date(),
        isLoading: true
      }
    ]);
    
    setIsProcessing(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock response
      const response = await generateMockResponse(question, pdfFile?.name || 'document');
      
      // Update the loading message with the response
      updateMessage(loadingMsgId, { 
        text: response.text, 
        isLoading: false,
        references: response.references
      });
    } catch (error) {
      updateMessage(loadingMsgId, { 
        text: "I'm sorry, I couldn't process your question. Please try again.", 
        isLoading: false 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        addMessage,
        clearChat,
        isProcessing,
        askQuestion,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};