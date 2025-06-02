import React, { useEffect, useRef } from 'react';
import { usePDF } from '../../context/PDFContext';

// Note: In a real implementation, you would use a library like PDF.js
// For this demo, we'll simulate a PDF viewer with a basic iframe

const PDFViewer: React.FC = () => {
  const { pdfFile, zoom, currentPage, setTotalPages } = usePDF();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate loading a PDF and getting page count
    if (pdfFile) {
      // In a real app, we would use PDF.js to get the page count
      // For demo, let's simulate a random page count between 5 and 30
      const pageCount = Math.floor(Math.random() * 25) + 5;
      setTotalPages(pageCount);
    }
  }, [pdfFile, setTotalPages]);

  if (!pdfFile) {
    return null;
  }

  return (
    <div 
      ref={containerRef} 
      className="h-full w-full overflow-auto"
      style={{ 
        transform: `scale(${zoom})`,
        transformOrigin: 'top left',
        transition: 'transform 0.2s ease'
      }}
    >
      <iframe
        src={pdfFile.url}
        className="w-full h-full"
        title="PDF Viewer"
        data-page={currentPage}
      />
    </div>
  );
};

export default PDFViewer;