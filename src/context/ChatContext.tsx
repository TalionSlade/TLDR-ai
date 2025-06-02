import React, { createContext, useState, useContext, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { generateMockResponse } from '../services/mockRagService';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  references?: {
    page: number;
    section: string;
    text: string;
  }[];
}

interface ChatContextType {
  messages: Message[];
  addMessage: (content: string, sender: 'user' | 'assistant') => void;
  isLoading: boolean;
  sendMessage: (content: string) => void;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatContextProvider');
  }
  return context;
};

interface ChatContextProviderProps {
  children: ReactNode;
}

export const ChatContextProvider = ({ children }: ChatContextProviderProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = (content: string, sender: 'user' | 'assistant') => {
    const newMessage: Message = {
      id: uuidv4(),
      content,
      sender,
      timestamp: new Date(),
    };
    
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    return newMessage;
  };

  const sendMessage = async (content: string) => {
    // Add user message
    addMessage(content, 'user');
    
    // Simulate assistant thinking
    setIsLoading(true);
    
    // Get mock response with artificial delay
    setTimeout(() => {
      const response = generateMockResponse(content);
      addMessage(response.content, 'assistant');
      setIsLoading(false);
    }, 1500);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const value = {
    messages,
    addMessage,
    isLoading,
    sendMessage,
    clearChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};