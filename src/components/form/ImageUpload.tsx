import { ChangeEvent, DragEvent, useState } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { ImageUploadState } from '../../types/features/cocktails'

interface ImageUploadProps {
  onImageSelect: (file: File) => void
  onImageClear: () => void
  className?: string
}

export function ImageUpload({ onImageSelect, onImageClear, className = '' }: ImageUploadProps) {
  const [state, setState] = useState<ImageUploadState>({
    file: null,
    preview: null,
    error: null,
    isUploading: false,
  })

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const file = e.dataTransfer.files[0]
    handleFileSelection(file)
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelection(file)
    }
  }

  const handleFileSelection = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setState(prev => ({ ...prev, error: 'Please select an image file' }))
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setState(prev => ({ ...prev, error: 'Image size should be less than 5MB' }))
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setState({
        file,
        preview: reader.result as string,
        error: null,
        isUploading: false,
      })
      onImageSelect(file)
    }
    reader.readAsDataURL(file)
  }

  const handleClear = () => {
    setState({
      file: null,
      preview: null,
      error: null,
      isUploading: false,
    })
    onImageClear()
  }

  return (
    <div className={className}>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="relative group"
      >
        {state.preview ? (
          <div className="relative">
            <img
              src={state.preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              onClick={handleClear}
              className="btn btn-circle btn-sm btn-ghost absolute top-2 right-2 bg-base-100/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-base-100 hover:scale-110"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-48 bg-base-200 border-2 border-dashed border-base-300 rounded-lg cursor-pointer hover:bg-base-300 transition-colors duration-200">
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
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>
    </div>
  )
}
