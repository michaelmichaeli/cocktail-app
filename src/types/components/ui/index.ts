import { AlcoholicType } from '../../features/cocktails';
import type { ErrorStateProps, DeleteDialogProps } from '../../ui/components';

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

export interface EmptyStateProps {
  message: string;
}

export interface ImageWithModalProps {
  src: string;
  alt: string;
}

export type { ErrorStateProps, DeleteDialogProps };