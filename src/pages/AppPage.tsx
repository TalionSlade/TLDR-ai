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
    <div className="min-h-screen flex flex-col bg-surface-100">
      {/* App header */}
      <header className="bg-white border-b border-surface-200 py-3">
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
      <main className="flex-1 py-6">
        <div className="container-wide h-[calc(100vh-8rem)]">
          {pdfFile ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
              {/* PDF viewer - takes 2/3 of the space */}
              <div className="lg:col-span-8 h-full">
                <PDFViewer />
              </div>
              
              {/* Chat interface - takes 1/3 of the space */}
              <div className="lg:col-span-4 h-full">
                <ChatInterface />
              </div>
            </div>
          ) : (
            <div className="h-full glass-card p-6">
              <PDFUploader />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AppPage;