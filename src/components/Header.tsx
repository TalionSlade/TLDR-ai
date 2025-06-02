import React from 'react';
import { FileText } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center">
        <div className="flex items-center">
          <FileText className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-xl font-semibold text-gray-800">Terms & Conditions Analyzer</h1>
        </div>
        
        <div className="ml-auto">
          <span className="text-sm text-gray-500">
            Analyze any Terms & Conditions document with AI
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;