import type { Cocktail } from "./cocktail";

export interface UseFormNavigationProps {
  isDirty: boolean;
  onSave?: () => void;
}

export type FilterType = 'ingredient' | 'glass' | 'category';

export interface FilterConfig {
  fetch: (value: string) => Promise<Cocktail[]>;
  title: string;
}

export interface DeleteCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export interface FilterDetails {
  title: string;
  queryParam: string;
  fetchFn: (value: string) => Promise<Cocktail[]>;
}
