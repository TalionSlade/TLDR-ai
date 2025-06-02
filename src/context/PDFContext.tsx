import React, { createContext, useState, useContext, ReactNode } from 'react';

interface PDFContextType {
  pdfFile: File | null;
  setPdfFile: (file: File | null) => void;
  fileInfo: {
    name: string;
    size: number;
    uploadTime: Date;
  } | null;
  isUploading: boolean;
  setIsUploading: (isUploading: boolean) => void;
  uploadProgress: number;
  setUploadProgress: (progress: number) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  setTotalPages: (pages: number) => void;
  scale: number;
  setScale: (scale: number) => void;
}

const PDFContext = createContext<PDFContextType | undefined>(undefined);

export const usePDFContext = () => {
  const context = useContext(PDFContext);
  if (!context) {
    throw new Error('usePDFContext must be used within a PDFContextProvider');
  }
  return context;
};

interface PDFContextProviderProps {
  children: ReactNode;
}

export const PDFContextProvider = ({ children }: PDFContextProviderProps) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [fileInfo, setFileInfo] = useState<PDFContextType['fileInfo']>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.0);

  // Update file info when pdfFile changes
  React.useEffect(() => {
    if (pdfFile) {
      setFileInfo({
        name: pdfFile.name,
        size: pdfFile.size,
        uploadTime: new Date(),
      });
    } else {
      setFileInfo(null);
    }
  }, [pdfFile]);

  const value = {
    pdfFile,
    setPdfFile,
    fileInfo,
    isUploading,
    setIsUploading,
    uploadProgress,
    setUploadProgress,
    currentPage,
    setCurrentPage,
    totalPages,
    setTotalPages,
    scale,
    setScale,
  };

  return <PDFContext.Provider value={value}>{children}</PDFContext.Provider>;
};