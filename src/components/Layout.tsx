import React from 'react';
import Header from './Header';
import PDFSection from './PDFSection';
import ChatSection from './ChatSection';
import { usePDF } from '../context/PDFContext';

const Layout: React.FC = () => {
  const { pdfFile } = usePDF();

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      
      <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
        <div className={`w-full md:w-1/2 lg:w-3/5 h-1/2 md:h-full flex flex-col ${!pdfFile ? 'items-center justify-center' : ''}`}>
          <PDFSection />
        </div>
        
        <div className="w-full md:w-1/2 lg:w-2/5 h-1/2 md:h-full flex flex-col border-t md:border-t-0 md:border-l border-gray-200">
          <ChatSection />
        </div>
      </div>
    </div>
  );
};

export default Layout;