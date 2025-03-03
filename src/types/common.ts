import type { ReactNode } from "react";

export interface BaseProps {
  className?: string;
}

export interface WithChildren {
  children?: ReactNode;
}

export interface LoadingState {
  isLoading: boolean;
  error?: Error | null;
}

export interface AsyncState<T> extends LoadingState {
  data?: T;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';
