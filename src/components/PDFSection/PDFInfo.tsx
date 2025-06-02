import React from 'react';
import { FileText, Calendar, HardDrive } from 'lucide-react';
import { usePDF } from '../../context/PDFContext';

const PDFInfo: React.FC = () => {
  const { pdfFile } = usePDF();

  if (!pdfFile) {
    return null;
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-gray-600">
      <div className="flex items-center">
        <FileText className="w-4 h-4 mr-1" />
        <span className="font-medium text-gray-800 mr-1">File:</span>
        <span className="truncate max-w-xs">{pdfFile.name}</span>
      </div>
      
      <div className="flex items-center">
        <HardDrive className="w-4 h-4 mr-1" />
        <span className="font-medium text-gray-800 mr-1">Size:</span>
        <span>{formatFileSize(pdfFile.size)}</span>
      </div>
      
      <div className="flex items-center">
        <Calendar className="w-4 h-4 mr-1" />
        <span className="font-medium text-gray-800 mr-1">Uploaded:</span>
        <span>{formatDate(pdfFile.uploadTime)}</span>
      </div>
    </div>
  );
};

export default PDFInfo;