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