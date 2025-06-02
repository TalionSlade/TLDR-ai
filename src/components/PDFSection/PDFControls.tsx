import React from 'react';
import { ZoomIn, ZoomOut, Search, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { usePDF } from '../../context/PDFContext';

const PDFControls: React.FC = () => {
  const { 
    zoom, 
    setZoom, 
    currentPage, 
    setCurrentPage, 
    totalPages,
    clearPDF
  } = usePDF();

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.1, 0.5));
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  return (
    <div className="flex items-center justify-between bg-gray-100 p-2 mb-3 rounded-md">
      <div className="flex items-center space-x-2">
        <button
          onClick={handleZoomOut}
          className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"
          title="Zoom out"
        >
          <ZoomOut className="w-5 h-5 text-gray-600" />
        </button>
        
        <button
          onClick={handleResetZoom}
          className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"
          title="Reset zoom"
        >
          <RefreshCw className="w-5 h-5 text-gray-600" />
        </button>
        
        <button
          onClick={handleZoomIn}
          className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"
          title="Zoom in"
        >
          <ZoomIn className="w-5 h-5 text-gray-600" />
        </button>
        
        <span className="text-sm text-gray-600 ml-1">
          {Math.round(zoom * 100)}%
        </span>
      </div>
      
      <div className="flex items-center">
        <button
          onClick={handlePrevPage}
          disabled={currentPage <= 1}
          className={`p-1.5 ${
            currentPage <= 1 ? 'text-gray-400' : 'hover:bg-gray-200 text-gray-600'
          } rounded-md transition-colors`}
          title="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <span className="text-sm mx-2">
          Page {currentPage} of {totalPages}
        </span>
        
        <button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
          className={`p-1.5 ${
            currentPage >= totalPages ? 'text-gray-400' : 'hover:bg-gray-200 text-gray-600'
          } rounded-md transition-colors`}
          title="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex items-center space-x-2">
        <button 
          className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"
          title="Search document"
        >
          <Search className="w-5 h-5 text-gray-600" />
        </button>
        
        <button
          onClick={clearPDF}
          className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
        >
          Replace
        </button>
      </div>
    </div>
  );
};

export default PDFControls;