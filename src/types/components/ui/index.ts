import { AlcoholicType } from '../../features/cocktails';

export interface CategoryBadgeProps {
  category: string;
  size?: "sm" | "md";
  noLink?: boolean;
}

export interface GlassBadgeProps {
  glass: string;
  size?: "sm" | "md";
  noLink?: boolean;
}

export interface AlcoholBadgeProps {
  type?: AlcoholicType;
  size?: "sm" | "md";
  noLink?: boolean;
}

export interface LoadingStateProps {
  message?: string;
}

export interface ErrorStateProps {
  title?: string;
  message: string;
}

export interface EmptyStateProps {
  message: string;
}

export interface ImageWithModalProps {
  src: string;
  alt: string;
}