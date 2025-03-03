import type { BaseProps } from '../../common';
import type { CocktailWithIngredients } from './models';

export * from './models';
export * from './forms';

export interface CocktailCardProps extends BaseProps {
  cocktail: CocktailWithIngredients;
  onDelete?: (id: string) => void;
}

export interface RecipeHeaderProps {
  name: string;
  category: string;
  glass: string;
  alcoholic: string;
  image: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export interface DeleteCallbacks {
  onSuccess: () => void;
  onError: (error: Error) => void;
  onSettled?: () => void;
}

export interface Ingredient {
  name: string;
  amount: string;
  unitOfMeasure: string;
}

export enum AlcoholicType {
  Alcoholic = "Alcoholic",
  NonAlcoholic = "Non alcoholic",
  Optional = "Optional alcohol"
} 