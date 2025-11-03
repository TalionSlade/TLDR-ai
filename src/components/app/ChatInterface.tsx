import React, { useState, useRef, useEffect } from 'react';
import type {
  AnchorHTMLAttributes,
  DetailedHTMLProps,
  HTMLAttributes,
  ReactNode
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SendHorizontal, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { useChatContext, Message } from '../../context/ChatContext';
import Button from '../common/Button';
import FAQDropdown from './FAQDropdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

const ChatInterface: React.FC = () => {
  const { messages, sendMessage, isLoading, clearChat } = useChatContext();
  const [input, setInput] = useState('');
  const [showFAQ, setShowFAQ] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
    const handleCopy = async () => {
      await copyToClipboard(message.content);
    };

    const isUser = message.sender === 'user';
    const mergeClassNames = (base: string, additional?: string) =>
      additional ? `${base} ${additional}` : base;

    type ParagraphProps = DetailedHTMLProps<
      HTMLAttributes<HTMLParagraphElement>,
      HTMLParagraphElement
    >;

    type ListProps = DetailedHTMLProps<
      HTMLAttributes<HTMLUListElement>,
      HTMLUListElement
    >;

    type OrderedListProps = DetailedHTMLProps<
      HTMLAttributes<HTMLOListElement>,
      HTMLOListElement
    >;

    type ListItemProps = DetailedHTMLProps<
      HTMLAttributes<HTMLLIElement>,
      HTMLLIElement
    >;

    type StrongProps = DetailedHTMLProps<
      HTMLAttributes<HTMLElement>,
      HTMLElement
    >;

    type AnchorProps = DetailedHTMLProps<
      AnchorHTMLAttributes<HTMLAnchorElement>,
      HTMLAnchorElement
    >;

    type BlockquoteProps = DetailedHTMLProps<
      HTMLAttributes<HTMLQuoteElement>,
      HTMLQuoteElement
    >;

    type HeadingProps = DetailedHTMLProps<
      HTMLAttributes<HTMLHeadingElement>,
      HTMLHeadingElement
    >;

    type CodeProps = {
      inline?: boolean;
      className?: string;
      children?: ReactNode;
    } & DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;

    const markdownComponents: Components = {
      p: ({ className, ...props }: ParagraphProps) => (
        <p
          className={mergeClassNames(
            'text-sm text-surface-800 leading-relaxed mb-2 last:mb-0',
            className
          )}
          {...props}
        />
      ),
      ul: ({ className, ...props }: ListProps) => (
        <ul
          className={mergeClassNames(
            'list-disc pl-5 text-sm text-surface-800 leading-relaxed mb-2',
            className
          )}
          {...props}
        />
      ),
      ol: ({ className, ...props }: OrderedListProps) => (
        <ol
          className={mergeClassNames(
            'list-decimal pl-5 text-sm text-surface-800 leading-relaxed mb-2',
            className
          )}
          {...props}
        />
      ),
      li: ({ className, ...props }: ListItemProps) => (
        <li className={mergeClassNames('mb-1 last:mb-0', className)} {...props} />
      ),
      strong: ({ className, ...props }: StrongProps) => (
        <strong
          className={mergeClassNames('text-surface-900 font-semibold', className)}
          {...props}
        />
      ),
      a: ({ className, target, rel, ...props }: AnchorProps) => (
        <a
          className={mergeClassNames('text-primary-600 underline font-medium', className)}
          target={target ?? '_blank'}
          rel={rel ?? 'noreferrer'}
          {...props}
        />
      ),
      blockquote: ({ className, ...props }: BlockquoteProps) => (
        <blockquote
          className={mergeClassNames(
            'border-l-4 border-primary-200 pl-3 text-surface-700 italic',
            className
          )}
          {...props}
        />
      ),
      code: ({ inline, className, children, ...props }: CodeProps) => {
        if (inline) {
          return (
            <code
              className={mergeClassNames(
                'bg-surface-100 text-surface-800 px-1 py-0.5 rounded',
                className
              )}
              {...props}
            >
              {children}
            </code>
          );
        }

        return (
          <pre className="bg-surface-100 text-surface-800 p-3 rounded-md overflow-x-auto text-xs">
            <code className={className} {...props}>
              {children}
            </code>
          </pre>
        );
      },
      h1: ({ className, ...props }: HeadingProps) => (
        <h3
          className={mergeClassNames(
            'text-lg font-semibold text-surface-900 mb-2',
            className
          )}
          {...props}
        />
      ),
      h2: ({ className, ...props }: HeadingProps) => (
        <h4
          className={mergeClassNames(
            'text-base font-semibold text-surface-900 mb-2',
            className
          )}
          {...props}
        />
      ),
      h3: ({ className, ...props }: HeadingProps) => (
        <h5
          className={mergeClassNames(
            'text-sm font-semibold text-surface-900 mb-2 uppercase tracking-wide',
            className
          )}
          {...props}
        />
      )
    };
    
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div
          className={`relative max-w-[85%] rounded-lg px-4 py-3 ${
            isUser 
              ? 'bg-primary-600 text-white rounded-br-none' 
              : 'bg-white border border-surface-200 rounded-bl-none'
          }`}
        >
          <div className="flex items-start gap-2">
            <div className="flex-1">
              {isUser ? (
                <p className="text-sm text-white leading-relaxed">
                  {message.content}
                </p>
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={markdownComponents}
                  className="space-y-2"
                >
                  {message.content}
                </ReactMarkdown>
              )}
            </div>
            
            {!isUser && (
              <button
                onClick={handleCopy}
                className="mt-1 text-surface-400 hover:text-surface-600 transition-colors"
                aria-label="Copy message"
              >
                <Copy size={14} />
              </button>
            )}
          </div>
          
          {/* References for assistant messages */}
          {message.references && message.references.length > 0 && (
            <div className="mt-2 pt-2 border-t border-surface-200">
              <p className="text-xs font-medium text-surface-500 mb-1">References:</p>
              {message.references.map((ref, index) => (
                <div key={index} className="text-xs text-surface-600 mb-1 last:mb-0">
                  <span className="font-medium">{ref.section}</span> (Page {ref.page})
                </div>
              ))}
            </div>
          )}
          
          <div className="absolute bottom-1 right-2 text-xs opacity-70">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-surface-50 rounded-lg overflow-hidden">
      {/* Chat header */}
      <div className="bg-white border-b border-surface-200 p-4 flex justify-between items-center flex-shrink-0">
        <h3 className="font-semibold text-surface-900">Chat with AI Assistant</h3>
        {messages.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearChat}
          >
            Clear Chat
          </Button>
        )}
      </div>
      
      {/* Chat messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-surface-100 min-h-0"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="bg-primary-50 p-4 rounded-full mb-4">
              <SendHorizontal size={32} className="text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold text-surface-900 mb-2">
              Ask about your document
            </h3>
            <p className="text-surface-600 max-w-md">
              Upload a Terms & Conditions document and ask questions to get insights and explanations in plain language.
            </p>
          </div>
        ) : (
          <>
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <MessageBubble message={message} />
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start mb-4"
              >
                <div className="bg-white border border-surface-200 rounded-lg rounded-bl-none px-4 py-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      {/* FAQ toggle */}
      <button
        onClick={() => setShowFAQ(!showFAQ)}
        className="bg-white border-t border-b border-surface-200 p-3 flex items-center justify-between text-surface-700 hover:bg-surface-50 transition-colors flex-shrink-0"
      >
        <span className="font-medium">Common Questions</span>
        {showFAQ ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      
      {/* FAQ section */}
      <AnimatePresence>
        {showFAQ && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-white border-b border-surface-200 flex-shrink-0"
          >
            <FAQDropdown onSelectQuestion={(question) => {
              sendMessage(question);
              setShowFAQ(false);
            }} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Chat input */}
      <div className="bg-white p-4 border-t border-surface-200 flex-shrink-0">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about the document..."
            className="input flex-1"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            icon={<SendHorizontal size={18} />}
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;