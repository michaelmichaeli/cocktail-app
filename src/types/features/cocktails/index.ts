import type { BaseProps } from '../../common';
import type { CustomCocktail } from './models';
import { AlcoholicType } from './models';

export * from './models';
export * from './forms';

export interface CocktailCardProps extends BaseProps {
  cocktail: CustomCocktail;
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

export { AlcoholicType }; 