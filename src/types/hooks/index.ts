import { DeleteCallbacks } from '../features/cocktails';
import { CustomCocktail } from '../features/cocktails';

export interface UseFormNavigationProps {
  isDirty: boolean;
  isSubmitting: boolean;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export type OptionalDeleteCallbacks = Partial<DeleteCallbacks>;

export interface UseCustomCocktailsResult {
  cocktails: CustomCocktail[];
  isLoading: boolean;
  deleteCustomCocktail: (id: string, callbacks?: OptionalDeleteCallbacks) => void;
  isDeletingCocktail: boolean;
} 