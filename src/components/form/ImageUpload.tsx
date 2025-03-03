import { useCallback, useRef, useState } from "react";
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { ImageUploadProps, ImageUploadState } from "../../types/components/form";

export function ImageUpload({ onImageSelect, initialImage }: ImageUploadProps) {
  const [state, setState] = useState<ImageUploadState>({
    previewUrl: initialImage || null,
    file: null,
    error: null,
    isUploading: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setState({
        previewUrl: reader.result as string,
        file,
        error: null,
        isUploading: false,
      });
      onImageSelect(file);
    };
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  const handleRemoveImage = useCallback(() => {
    setState((prev: ImageUploadState) => ({
      ...prev,
      previewUrl: null,
      file: null,
      error: null,
      isUploading: false,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onImageSelect(null);
  }, [onImageSelect]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    setState((prev: ImageUploadState) => ({
      ...prev,
      previewUrl: URL.createObjectURL(file),
      file,
      error: null,
      isUploading: false,
    }));
    onImageSelect(file);
  }, [onImageSelect]);

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="relative group">
      {state.previewUrl ? (
        <div className="relative">
          <img
            src={state.previewUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            onClick={handleRemoveImage}
            className="btn btn-circle btn-sm btn-ghost absolute top-2 right-2 bg-base-100/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-base-100 hover:scale-110"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label 
          className="flex flex-col items-center justify-center w-full h-48 bg-base-200 border-2 border-dashed border-base-300 rounded-lg cursor-pointer hover:bg-base-300 transition-colors duration-200"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
            {state.error ? (
              <>
                <X className="h-8 w-8 text-error mb-2" />
                <p className="text-error">{state.error}</p>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-2 text-base-content/60 mb-2">
                  <Upload className="h-6 w-6" />
                  <ImageIcon className="h-6 w-6" />
                </div>
                <p className="text-sm text-base-content/60">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-base-content/40 mt-1">
                  PNG, JPG or GIF (max. 5MB)
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
            ref={fileInputRef}
          />
        </label>
      )}
    </div>
  );
}
