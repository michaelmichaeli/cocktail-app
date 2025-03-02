import type { BaseProps } from "../common";
import type { Cocktail } from "./cocktails";

export type FilterType = 'ingredient' | 'glass' | 'category';

export interface FilterConfig {
  fetch: (value: string) => Promise<Cocktail[]>;
  title: string;
}

export interface FilterDetails {
  title: string;
  queryParam: string;
  fetchFn: (value: string) => Promise<Cocktail[]>;
}

export interface DeleteCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export interface FilterListResponse {
  drinks: Array<{
    [key: string]: string;
  }>;
}

export interface FilterOptions {
  isAlcoholic?: boolean | null;
  category?: string;
  glass?: string;
  tags?: string[];
}

export interface Filters {
  categories: string[];
  glasses: string[];
  ingredients: string[];
  alcoholicTypes: string[];
  isLoading: boolean;
  error: string | null;
}

export interface FilterBarProps extends BaseProps {
  initialFilters?: FilterOptions;
  onSubmit: (filters: FilterOptions) => void;
}
