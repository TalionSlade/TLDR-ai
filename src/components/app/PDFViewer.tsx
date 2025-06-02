import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Search, 
  X,
  Trash2,
  FileText
} from 'lucide-react';
import { usePDFContext } from '../../context/PDFContext';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { formatDistanceToNow } from 'date-fns';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer: React.FC = () => {
  const { 
    pdfFile, 
    setPdfFile,
    fileInfo, 
    currentPage, 
    setCurrentPage, 
    totalPages, 
    setTotalPages,
    scale,
    setScale
  } = usePDFContext();
  
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    // Only update if the total pages actually changed to prevent re-renders
    if (totalPages !== numPages) {
      setTotalPages(numPages);
    }
    setIsLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    setIsLoading(false);
    setError('Failed to load PDF. Please try uploading again.');
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const zoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.2, 2.0));
  };

  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.2, 0.6));
  };

  const resetZoom = () => {
    setScale(1.0);
  };

  const handleDeleteFile = () => {
    setPdfFile(null);
    setCurrentPage(1);
    setTotalPages(0);
    setError(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (!pdfFile) {
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-surface-100 rounded-lg overflow-hidden">
      {/* Document header with info */}
      <div className="bg-white border-b border-surface-200 p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="bg-primary-100 p-2 rounded-md mr-3">
              <FileText className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-medium text-surface-900 truncate max-w-[200px]">
                {fileInfo?.name}
              </h3>
              <div className="flex text-sm text-surface-500 mt-1 space-x-2">
                <span>{formatFileSize(fileInfo?.size || 0)}</span>
                <span>•</span>
                <span>
                  {fileInfo?.uploadTime
                    ? `Uploaded ${formatDistanceToNow(fileInfo.uploadTime, { addSuffix: true })}`
                    : ''}
                </span>
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            icon={<Trash2 size={16} />}
            onClick={handleDeleteFile}
            className="text-red-500 hover:bg-red-50 hover:border-red-200"
          >
            Remove
          </Button>
        </div>
      </div>
      
      {/* PDF controls */}
      <div className="bg-white border-b border-surface-200 p-2 flex justify-between items-center">
        <div className="flex items-center space-x-1">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToPreviousPage}
            disabled={currentPage <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft size={18} />
          </Button>
          
          <div className="px-2">
            <span className="text-surface-700">
              Page <span className="font-medium">{currentPage}</span> of{' '}
              <span className="font-medium">{totalPages}</span>
            </span>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToNextPage}
            disabled={currentPage >= totalPages}
            aria-label="Next page"
          >
            <ChevronRight size={18} />
          </Button>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={zoomOut}
            disabled={scale <= 0.6}
            aria-label="Zoom out"
          >
            <ZoomOut size={18} />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetZoom}
            aria-label="Reset zoom"
          >
            <RotateCw size={18} />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={zoomIn}
            disabled={scale >= 2.0}
            aria-label="Zoom in"
          >
            <ZoomIn size={18} />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowSearch(!showSearch)}
            className={showSearch ? "bg-surface-100" : ""}
            aria-label="Search"
          >
            <Search size={18} />
          </Button>
        </div>
      </div>
      
      {/* Search bar */}
      {showSearch && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-white border-b border-surface-200 p-2"
        >
          <div className="relative">
            <input
              type="text"
              className="input pr-10"
              placeholder="Search in document..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            {searchText && (
              <button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-surface-500 hover:text-surface-700"
                onClick={() => setSearchText('')}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* PDF document */}
      <div className="flex-1 overflow-auto bg-surface-200 p-4">
        {error ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-red-600">
              <p>{error}</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center h-full">
            <Document
              file={pdfFile}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="h-full flex items-center justify-center">
                  <LoadingSpinner size="lg" />
                </div>
              }
              className="w-full h-full"
            >
              <Page
                pageNumber={currentPage}
                scale={scale}
                renderTextLayer={false}  // Disable TextLayer to prevent duplicate content
                renderAnnotationLayer={false}  // Also disable annotation layer if not needed
                loading={
                  <div className="h-full flex items-center justify-center">
                    <LoadingSpinner size="md" />
                  </div>
                }
                className="mx-auto shadow-lg"
              />
            </Document>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;