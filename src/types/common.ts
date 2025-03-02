import type { ReactNode } from "react";

// Error Boundary types
export interface ErrorBoundaryProps {
  children?: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

// Common utility types
export interface BaseProps {
  className?: string;
}

export interface WithChildren {
  children?: ReactNode;
}

// Common state types
export interface LoadingState {
  isLoading: boolean;
  error?: Error | null;
}

export interface AsyncState<T> extends LoadingState {
  data?: T;
}
