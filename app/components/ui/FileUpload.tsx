
import React, { useRef, useState } from 'react';
import { Upload, X, FileText, ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadProps {
  label: string;
  description?: string;
  accept?: string;
  maxSizeMB?: number;
  onFileSelect: (file: File | null) => void;
  currentFile: File | null;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  description,
  accept = "image/*,.pdf",
  maxSizeMB = 5,
  onFileSelect,
  currentFile,
  className = ""
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    validateAndProcessFile(file);
  };

  const validateAndProcessFile = (file: File | undefined) => {
    setError(null);
    if (!file) return;

    // Size check
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB limit.`);
      return;
    }

    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    validateAndProcessFile(file);
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isImage = currentFile?.type.startsWith('image/');
  const previewUrl = currentFile && isImage ? URL.createObjectURL(currentFile) : null;

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">{label}</label>
      
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative cursor-pointer border-2 border-dashed rounded-[1.5rem] transition-all overflow-hidden flex flex-col items-center justify-center p-6 text-center min-h-[140px] ${
          isDragging ? 'border-jozi-gold bg-jozi-gold/5 scale-[0.99]' : 'border-gray-200 bg-gray-50 hover:border-jozi-gold/40'
        } ${currentFile ? 'border-emerald-500/30 bg-emerald-50/10' : ''}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {!currentFile ? (
            <motion.div
              key="upload-prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto shadow-sm text-gray-400 group-hover:text-jozi-gold transition-colors">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-jozi-forest">Drop file or click to browse</p>
              {description && <p className="text-[10px] text-gray-400">{description}</p>}
            </motion.div>
          ) : (
            <motion.div
              key="file-preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full flex items-center space-x-4 px-2"
            >
              {isImage ? (
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-gray-100 bg-white">
                  <img src={previewUrl!} className="w-full h-full object-cover" alt="Preview" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0">
                  <FileText className="w-8 h-8 text-jozi-forest/40" />
                </div>
              )}
              
              <div className="flex-grow text-left min-w-0">
                <p className="text-xs font-black text-jozi-forest truncate">{currentFile.name}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {(currentFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <div className="flex items-center text-emerald-500 text-[9px] font-black uppercase mt-1">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Ready
                </div>
              </div>

              <button
                onClick={removeFile}
                className="p-2 bg-white rounded-full text-gray-400 hover:text-red-500 shadow-sm border border-gray-100 transition-all hover:scale-110"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center text-red-500 text-[10px] font-bold mt-1 px-1"
        >
          <AlertCircle className="w-3 h-3 mr-1" />
          {error}
        </motion.div>
      )}
    </div>
  );
};

export default FileUpload;
