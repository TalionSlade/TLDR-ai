import React from 'react';
import PDFUpload from './PDFUpload';
import PDFViewer from './PDFViewer';
import PDFControls from './PDFControls';
import PDFInfo from './PDFInfo';
import { usePDF } from '../../context/PDFContext';

const PDFSection: React.FC = () => {
  const { pdfFile, isPDFLoading } = usePDF();

  return (
    <div className="flex flex-col h-full w-full p-4">
      {!pdfFile ? (
        <PDFUpload />
      ) : (
        <>
          <PDFInfo />
          <PDFControls />
          <div className="flex-grow overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
            {isPDFLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-200 mb-3"></div>
                  <div className="text-sm text-gray-500">Loading document...</div>
                </div>
              </div>
            ) : (
              <PDFViewer />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PDFSection;