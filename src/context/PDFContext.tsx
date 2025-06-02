import React, { createContext, useState, useContext, ReactNode } from 'react';

interface PDFFile {
  file: File;
  url: string;
  name: string;
  size: number;
  uploadTime: Date;
}

interface PDFContextType {
  pdfFile: PDFFile | null;
  setPDFFile: (file: File) => void;
  clearPDF: () => void;
  isPDFLoading: boolean;
  setIsPDFLoading: (loading: boolean) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  setTotalPages: (pages: number) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
}

const PDFContext = createContext<PDFContextType | undefined>(undefined);

export const usePDF = () => {
  const context = useContext(PDFContext);
  if (context === undefined) {
    throw new Error('usePDF must be used within a PDFProvider');
  }
  return context;
};

export const PDFProvider = ({ children }: { children: ReactNode }) => {
  const [pdfFile, setPDFFileState] = useState<PDFFile | null>(null);
  const [isPDFLoading, setIsPDFLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(1);

  const setPDFFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setPDFFileState({
      file,
      url,
      name: file.name,
      size: file.size,
      uploadTime: new Date(),
    });
  };

  const clearPDF = () => {
    if (pdfFile?.url) {
      URL.revokeObjectURL(pdfFile.url);
    }
    setPDFFileState(null);
    setCurrentPage(1);
    setTotalPages(0);
  };

  return (
    <PDFContext.Provider
      value={{
        pdfFile,
        setPDFFile,
        clearPDF,
        isPDFLoading,
        setIsPDFLoading,
        currentPage,
        setCurrentPage,
        totalPages,
        setTotalPages,
        zoom,
        setZoom,
      }}
    >
      {children}
    </PDFContext.Provider>
  );
};