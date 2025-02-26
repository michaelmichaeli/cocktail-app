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
