export interface TextFieldProps {
  label: string;
  name: string;
  placeholder?: string;
  error?: string;
}

export interface SelectFieldProps {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  error?: string;
}

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  error?: string;
}

export interface IngredientsFieldProps {
  ingredients: string[];
  onIngredientsChange: (ingredients: string[]) => void;
  error?: string;
}

export interface ImageUploadProps {
  onImageSelect: (file: File | null) => void;
  initialImage?: string;
  className?: string;
}

export interface ImageUploadState {
  previewUrl: string | null;
  file: File | null;
  error: string | null;
  isUploading: boolean;
}

export interface FormErrorMessageProps {
  message: string;
}

export interface AlcoholicTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
} 