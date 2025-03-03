import type { ReactNode } from 'react';
import type { Cocktail, CocktailWithIngredients, AlcoholicType } from '../cocktails';
import type { BaseProps } from '../../common';

export type FilterType = 'ingredient' | 'glass' | 'category';

export interface FilterConfig {
  title: string;
  icon: ReactNode;
  param: string;
  fetch: (value: string) => Promise<Cocktail[]>;
  matchCustom: (cocktail: CocktailWithIngredients, value: string) => boolean;
}

export interface FilterDetails {
  type: FilterType;
  value: string;
  count: number;
}

export interface FilterPageDetails {
  title: string;
  icon: ReactNode;
  param: string;
  fetch: (value: string) => Promise<Cocktail[]>;
}

export interface FilterBarProps extends BaseProps {
  onFilterSelect: (filter: FilterConfig) => void;
  selectedFilters: FilterConfig[];
  initialFilters?: FilterOptions;
  onSubmit: (filters: FilterOptions) => void;
}

export interface FilteredCocktailsHeaderProps {
  title: string;
  filterType: FilterType;
  filterValue: string;
  icon: ReactNode;
}

export interface FilterListResponse {
  drinks: Array<{
    [key: string]: string;
  }>;
}

export interface FilterOptions {
  alcoholicType?: AlcoholicType | null;
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