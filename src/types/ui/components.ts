import type { UseFormRegister } from "react-hook-form";
import type { CocktailFormData } from "../../lib/schemas";
import type { BaseProps } from "../common";

export interface TextFieldProps extends BaseProps {
  id: string;
  label: string;
  error?: string;
  type?: string;
  required?: boolean;
}

export interface TagInputProps extends BaseProps {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  suggestions?: string[];
  label?: string;
  placeholder?: string;
  error?: string;
}

export interface LoadingStateProps extends BaseProps {
  text?: string;
}

export interface IngredientsFieldProps extends BaseProps {
  register: UseFormRegister<CocktailFormData>;
  error?: string;
}

export interface ImageWithModalProps extends BaseProps {
  src: string;
  alt: string;
}

export interface FormErrorMessageProps extends BaseProps {
  message: string;
}

export interface ImageUploadProps extends BaseProps {
  onImageSelect: (file: File) => void;
  defaultImage?: string;
}

export interface FilteredCocktailsHeaderProps extends BaseProps {
  title: string;
  subtitle?: string;
  isLoading?: boolean;
}

export interface ErrorStateProps extends BaseProps {
  title: string;
  message?: string;
}

export interface EmptyStateProps extends BaseProps {
  title: string;
  message?: string;
}

export interface DeleteDialogProps extends BaseProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isDeleting?: boolean;
}
