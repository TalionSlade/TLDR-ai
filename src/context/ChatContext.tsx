import { createContext, useState, useContext, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { sendChatMessage } from '../services/ragService';
import { usePDFContext } from './PDFContext';

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
  const { sessionId } = usePDFContext();

  const addMessage = (content: string, sender: 'user' | 'assistant', references?: Message['references']) => {
    const newMessage: Message = {
      id: uuidv4(),
      content,
      sender,
      timestamp: new Date(),
      references,
    };
    
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    return newMessage;
  };

  const sendMessage = async (content: string) => {
    // Check if session exists
    if (!sessionId) {
      addMessage(
        'Please upload a PDF document first before asking questions.',
        'assistant'
      );
      return;
    }

    // Add user message
    addMessage(content, 'user');
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Call real backend API
      const response = await sendChatMessage(content, sessionId);
      
      // Add assistant response with references
      addMessage(response.content, 'assistant', response.references);
    } catch (error) {
      // Handle errors
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to get response from server. Please try again.';
      
      addMessage(
        `Sorry, I encountered an error: ${errorMessage}`,
        'assistant'
      );
    } finally {
      setIsLoading(false);
    }
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