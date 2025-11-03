import React, { useState } from 'react';
import { MessageSquare, Search, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { commonFAQs } from '../../services/ragService';

interface FAQDropdownProps {
  onSelectQuestion: (question: string) => void;
}

const FAQDropdown: React.FC<FAQDropdownProps> = ({ onSelectQuestion }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Get unique categories
  const categories = Array.from(
    new Set(commonFAQs.map((faq) => faq.category))
  );
  
  // Filter FAQs by search term and category
  const filteredFAQs = commonFAQs.filter((faq) => {
    const matchesSearch = searchTerm === '' || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === null || 
      faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4">
      {/* Search and categories */}
      <div className="mb-4">
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500">
            <Search size={18} />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-500 hover:text-surface-700"
            >
              <X size={18} />
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`badge ${
              selectedCategory === null
                ? 'badge-primary'
                : 'badge-outline'
            }`}
          >
            All
          </button>
          
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`badge ${
                selectedCategory === category
                  ? 'badge-primary'
                  : 'badge-outline'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {/* FAQ list */}
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-4 text-surface-500">
            No questions found matching your search
          </div>
        ) : (
          filteredFAQs.map((faq) => (
            <motion.div
              key={faq.id}
              className="bg-surface-50 hover:bg-surface-100 rounded-lg p-3 cursor-pointer transition-colors"
              onClick={() => onSelectQuestion(faq.question)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-start">
                <MessageSquare size={18} className="text-primary-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-surface-800 font-medium">{faq.question}</p>
                  <div className="mt-1 flex items-center">
                    <span className="text-xs text-surface-500 font-medium">
                      {faq.category}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default FAQDropdown;