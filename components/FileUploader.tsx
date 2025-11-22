import React, { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle2, FileType, AlertCircle } from 'lucide-react';
import { UploadedFile } from '../types';
import { ALLOWED_TYPES, MAX_FILE_SIZE_MB } from '../constants';

interface FileUploaderProps {
  files: UploadedFile[];
  setFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ files, setFiles }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type) && !file.name.endsWith('.txt') && !file.name.endsWith('.pdf')) {
        return 'Formato no soportado';
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        return `Archivo excede ${MAX_FILE_SIZE_MB}MB`;
    }
    return null;
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const processFile = async (file: File) => {
    if (files.some(f => f.name === file.name && f.status === 'ready')) return;

    const errorMsg = validateFile(file);

    const newFile: UploadedFile = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type || 'text/plain',
      status: errorMsg ? 'error' : 'uploading',
      progress: 0,
    };

    setFiles((prev) => [...prev, newFile]);

    if (errorMsg) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += 15;
      setFiles((prev) =>
        prev.map((f) => (f.id === newFile.id ? { ...f, progress: Math.min(progress, 90) } : f))
      );

      if (progress >= 90) {
        clearInterval(interval);
      }
    }, 150);

    try {
      const base64Content = await readFileAsBase64(file);
      clearInterval(interval);
      setFiles((prev) =>
        prev.map((f) => 
          f.id === newFile.id 
            ? { 
                ...f, 
                status: 'ready', 
                progress: 100,
                content: base64Content,
                mimeType: file.type || 'text/plain'
              } 
            : f
        )
      );
    } catch (error) {
      clearInterval(interval);
      setFiles((prev) =>
        prev.map((f) => (f.id === newFile.id ? { ...f, status: 'error' } : f))
      );
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    droppedFiles.forEach((file: unknown) => processFile(file as File));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      selectedFiles.forEach((file: unknown) => processFile(file as File));
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-xl font-heading font-bold text-gray-900 mb-1">Subir archivos</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          Sube tus archivos para que Kognia IA pueda razonar sobre ellos.
        </p>
      </div>

      {/* Drop Zone */}
      <div
        className={`
          relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ease-out
          flex flex-col items-center justify-center text-center cursor-pointer group overflow-hidden
          ${
            isDragging
              ? 'border-kognia-blue bg-blue-50/50 scale-[0.99] ring-4 ring-blue-100'
              : 'border-gray-300 hover:border-kognia-pink hover:bg-gray-50'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept=".pdf,.txt"
          onChange={handleFileInput}
        />
        
        <div className={`
            w-14 h-14 rounded-2xl shadow-sm flex items-center justify-center mb-4 transition-all duration-300
            ${isDragging ? 'bg-kognia-blue text-white scale-110' : 'bg-white text-kognia-pink group-hover:text-white group-hover:bg-brand-gradient group-hover:scale-110'}
        `}>
            <Upload className="w-7 h-7" />
        </div>
        
        <h3 className="text-sm font-bold text-gray-900 mb-1">
            {isDragging ? 'Suelta los archivos' : 'Click o Arrastra aquí'}
        </h3>
        <p className="text-xs text-gray-400 max-w-[200px]">
            Soportado: PDF, TXT (Max {MAX_FILE_SIZE_MB}MB)
        </p>
      </div>

      {/* File List */}
      <div className="mt-6 flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
        {files.length === 0 && (
            <div className="text-center py-10 opacity-50 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                <FileType className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-400">Sin documentos activos</p>
            </div>
        )}
        
        {files.map((file) => (
          <div
            key={file.id}
            className={`
                group relative bg-white border rounded-xl p-3 transition-all flex items-center gap-3
                ${file.status === 'error' ? 'border-red-200 bg-red-50/30' : 'border-gray-100 shadow-sm hover:shadow-md hover:border-kognia-blue/30'}
            `}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                file.status === 'ready' ? 'bg-green-50 text-green-600' : 
                file.status === 'error' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
            }`}>
              {file.status === 'error' ? <AlertCircle size={20} /> : <FileText size={20} />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <p className={`text-sm font-medium truncate pr-2 ${file.status === 'error' ? 'text-red-700' : 'text-gray-700'}`}>
                  {file.name}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.id);
                  }}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-gray-100"
                >
                  <X size={14} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{formatSize(file.size)}</span>
                
                {file.status === 'uploading' && (
                    <div className="flex items-center gap-2 w-24">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-brand-gradient transition-all duration-200 rounded-full" 
                                style={{ width: `${file.progress}%` }}
                            />
                        </div>
                    </div>
                )}
                
                {file.status === 'ready' && (
                    <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 size={10} /> Ready
                    </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};