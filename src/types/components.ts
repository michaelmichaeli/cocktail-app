import type { ReactNode } from "react";
import type { UseFormRegister } from "react-hook-form";
import type { CocktailFormData } from "../lib/schemas";
import type { CocktailWithIngredients } from "./cocktail";
import type { FilterOptions } from "./filters";

export interface FilterBarProps {
  initialFilters?: FilterOptions;
  onSubmit: (filters: FilterOptions) => void;
}

export interface TextFieldProps {
  id: string;
  label: string;
  error?: string;
  type?: string;
  required?: boolean;
  className?: string;
}

export interface RecipeHeaderProps {
  name: string;
  glass?: string;
  category?: string;
  isAlcoholic?: boolean;
  imageUrl?: string;
  lastModified?: Date;
}

export interface TagInputProps {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  suggestions?: string[];
  label?: string;
  placeholder?: string;
  error?: string;
  className?: string;
}

export interface LoadingStateProps {
  text?: string;
  className?: string;
}

export interface IngredientsFieldProps {
  register: UseFormRegister<CocktailFormData>;
  error?: string;
}

export interface ImageWithModalProps {
  src: string;
  alt: string;
  className?: string;
}

export interface FormErrorMessageProps {
  message: string;
  className?: string;
}

export interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  defaultImage?: string;
  className?: string;
}

export interface FilterHeaderProps {
  title: string;
  subtitle?: string;
  isLoading?: boolean;
}

export interface ErrorStateProps {
  title: string;
  message?: string;
  className?: string;
}

export interface ErrorBoundaryProps {
  children?: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isDeleting?: boolean;
}

export interface EmptyStateProps {
  title: string;
  message?: string;
  className?: string;
}

export interface CocktailGridProps {
  cocktails: CocktailWithIngredients[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
  className?: string;
}

export interface CocktailCardProps {
  cocktail: CocktailWithIngredients;
  onDelete?: () => void;
  className?: string;
}
