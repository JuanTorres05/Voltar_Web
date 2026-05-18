'use client';

import { useState, useRef } from 'react';
import { UploadCloud, X } from 'lucide-react';

interface DesignUploaderProps {
  onImageUpload: (url: string | null) => void;
}

export default function DesignUploader({ onImageUpload }: DesignUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setError('');
    
    // Validar tipo
    if (!['image/png', 'image/svg+xml'].includes(file.type)) {
      setError('SÓLO SE PERMITEN ARCHIVOS PNG O SVG.');
      return;
    }
    
    // Validar tamaño (Max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('EL ARCHIVO EXCEDE LOS 5MB.');
      return;
    }

    setFileName(file.name);
    const objectUrl = URL.createObjectURL(file);
    onImageUpload(objectUrl);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const clearUpload = () => {
    setFileName('');
    onImageUpload(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      {fileName ? (
        <div className="flex items-center justify-between border border-border bg-background p-4">
          <span className="truncate text-sm font-bold text-volt">{fileName}</span>
          <button 
            onClick={clearUpload}
            className="text-muted-fg hover:text-red-brand transition-colors"
            title="Quitar diseño"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`group flex cursor-pointer flex-col items-center justify-center border-2 border-dashed p-8 text-center transition-all ${
            isDragging 
              ? 'border-volt bg-volt/5' 
              : 'border-border hover:border-volt hover:bg-surface'
          }`}
        >
          <UploadCloud className={`mb-4 h-10 w-10 transition-colors ${isDragging ? 'text-volt' : 'text-muted-fg group-hover:text-volt'}`} />
          <p className="text-sm font-bold uppercase tracking-widest text-foreground">
            Arrastra tu diseño aquí
          </p>
          <p className="mt-2 text-[10px] uppercase text-muted-fg">
            PNG transparente o SVG (Máx 5MB)
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 border border-red-brand/30 bg-red-brand/10 p-3 text-xs font-bold uppercase tracking-widest text-red-brand animate-fade-up">
          {error}
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".png, .svg"
        onChange={handleChange}
      />
    </div>
  );
}
