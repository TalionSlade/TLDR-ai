import React, { useCallback, useState } from 'react';
import { FileUp, AlertCircle } from 'lucide-react';
import { usePDF } from '../../context/PDFContext';

const PDFUpload: React.FC = () => {
  const { setPDFFile, setIsPDFLoading } = usePDF();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      setIsPDFLoading(true);
      setPDFFile(file);
      
      // Simulate loading delay
      setTimeout(() => {
        setIsPDFLoading(false);
      }, 1500);
    },
    [setPDFFile, setIsPDFLoading]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      
      if (e.dataTransfer.files.length) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        handleFile(e.target.files[0]);
      }
    },
    [handleFile]
  );

  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center p-8 ${
        isDragging
          ? 'border-2 border-blue-500 bg-blue-50'
          : 'border-2 border-dashed border-gray-300'
      } rounded-lg transition-all duration-200`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <FileUp
        className={`w-16 h-16 mb-4 ${
          isDragging ? 'text-blue-500' : 'text-gray-400'
        }`}
      />
      
      <h2 className="text-xl font-medium text-gray-700 mb-2">
        Upload Terms & Conditions
      </h2>
      
      <p className="text-gray-500 mb-6 text-center max-w-md">
        Drag and drop a PDF file here, or click to select a file
      </p>
      
      <label className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md cursor-pointer transition-colors duration-150">
        Select PDF File
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileInputChange}
          className="sr-only"
        />
      </label>
      
      {error && (
        <div className="flex items-center mt-4 text-red-600">
          <AlertCircle className="w-4 h-4 mr-1" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
};

export default PDFUpload;