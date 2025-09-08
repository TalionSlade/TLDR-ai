import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ChevronLeft } from 'lucide-react';
import { usePDFContext } from '../context/PDFContext';
import PDFUploader from '../components/app/PDFUploader';
import PDFViewer from '../components/app/PDFViewer';
import ChatInterface from '../components/app/ChatInterface';

const AppPage: React.FC = () => {
  const { pdfFile } = usePDFContext();

  return (
    <div className="h-screen flex flex-col bg-surface-100 overflow-hidden">
      {/* App header */}
      <header className="bg-white border-b border-surface-200 py-3 flex-shrink-0">
        <div className="container-wide flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center mr-8 gap-2">
              <FileText size={24} className="text-primary-600" />
              <span className="text-lg font-display font-bold text-surface-950">
                LegalLens
              </span>
            </Link>
            
            <Link to="/" className="text-surface-600 hover:text-surface-900 flex items-center text-sm">
              <ChevronLeft size={16} className="mr-1" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>
      
      {/* Main app area */}
      <main className="flex-1 py-4 md:py-6 overflow-hidden">
        <div className="container-wide h-full">
          {pdfFile ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 h-full">
              {/* PDF viewer - takes 2/3 of the space */}
              <div className="lg:col-span-8 h-full min-h-0 order-2 lg:order-1">
                <PDFViewer />
              </div>
              
              {/* Chat interface - takes 1/3 of the space */}
              <div className="lg:col-span-4 h-full min-h-0 order-1 lg:order-2">
                <ChatInterface />
              </div>
            </div>
          ) : (
            <div className="h-full glass-card p-4 md:p-6 overflow-auto">
              <PDFUploader />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AppPage;