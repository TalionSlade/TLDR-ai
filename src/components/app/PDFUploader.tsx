import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, X } from 'lucide-react';
import { usePDFContext } from '../../context/PDFContext';
import Button from '../common/Button';

const PDFUploader: React.FC = () => {
  const { setPdfFile, isUploading, setIsUploading, uploadProgress, setUploadProgress } = usePDFContext();
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDragActive(false);
  }, []);

  const handleFile = useCallback(
    (file: File | null) => {
      if (!file) return;

      // Check if file is PDF
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        return;
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size should be less than 10MB');
        return;
      }

      setError(null);
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            setPdfFile(file);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    },
    [setIsUploading, setUploadProgress, setPdfFile]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragActive(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFile(e.target.files[0]);
      }
    },
    [handleFile]
  );

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6">
      <motion.div
        className={`w-full max-w-lg border-2 border-dashed rounded-xl p-6 ${
          isDragActive ? 'border-primary-500 bg-primary-50' : 'border-surface-300'
        } transition-colors duration-200 text-center`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {isUploading ? (
          <div className="py-8">
            <div className="mb-4 flex justify-center">
              <FileText size={48} className="text-primary-500" />
            </div>
            <p className="mb-2 text-surface-700">Uploading your document...</p>
            <div className="w-full bg-surface-200 rounded-full h-2.5 mb-4">
              <div
                className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-surface-500">{uploadProgress}% complete</p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex justify-center">
              <Upload size={48} className="text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Upload Your Terms & Conditions</h3>
            <p className="text-surface-600 mb-6">
              Drag and drop your PDF file here, or click to browse
            </p>

            <input
              id="file-upload"
              type="file"
              accept="application/pdf"
              onChange={onFileChange}
              className="hidden"
            />
            <Button
              as="label"
              htmlFor="file-upload"
              variant="outline"
              className="cursor-pointer"
            >
              Select PDF File
            </Button>

            {error && (
              <div className="mt-4 text-red-500 flex items-center gap-2">
                <X size={16} /> {error}
              </div>
            )}

            <p className="mt-4 text-sm text-surface-500">
              Max file size: 10MB | PDF files only
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default PDFUploader;