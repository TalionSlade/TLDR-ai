import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQDropdownProps {
  onSelectQuestion: (question: string) => void;
  disabled?: boolean;
}

const FAQDropdown: React.FC<FAQDropdownProps> = ({ onSelectQuestion, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  const faqQuestions = [
    "What is the refund policy?",
    "How can I cancel my account?",
    "What data do you collect?",
    "What are the payment terms?",
    "How do you handle disputes?",
    "What happens if I violate the terms?",
    "Can I share my account with others?",
    "What are the limitations of liability?"
  ];

  const handleSelectQuestion = (question: string) => {
    onSelectQuestion(question);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-4 py-2 text-sm rounded-md border ${
          disabled
            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
        } transition-colors`}
      >
        <div className="flex items-center">
          <HelpCircle className="h-4 w-4 mr-2" />
          <span>Common Questions</span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>
      
      {isOpen && !disabled && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden transition-all duration-200 max-h-64 overflow-y-auto">
          <ul className="py-1">
            {faqQuestions.map((question, index) => (
              <li key={index}>
                <button
                  onClick={() => handleSelectQuestion(question)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  {question}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FAQDropdown;