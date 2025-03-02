import type { BaseProps } from "../common";

export interface Ingredient {
  name: string;
  amount: string;
  unitOfMeasure: string;
}

export enum AlcoholicType {
  ALCOHOLIC = 'Alcoholic',
  NON_ALCOHOLIC = 'Non alcoholic',
  OPTIONAL = 'Optional alcohol'
}

export interface Cocktail {
  idDrink: string;
  strDrink: string;
  strInstructions: string;
  strDrinkThumb: string;
  strTags?: string;
  strCategory?: string;
  strGlass?: string;
  strAlcoholic?: AlcoholicType;
  dateModified?: string;
  [key: string]: string | undefined;
}

export interface CocktailList {
  drinks: Cocktail[];
}

export interface CustomCocktail {
  id: string;
  name: string;
  instructions: string;
  imageUrl?: string;
  imageFile?: File;
  ingredients: Ingredient[];
  isCustom?: boolean;
  tags?: string[];
  category?: string;
  glass?: string;
  alcoholicType?: AlcoholicType | undefined | null;
  dateModified: string;
}

export interface CocktailWithIngredients extends Omit<CustomCocktail, 'imageFile'> {
  ingredients: Ingredient[];
}

export interface ImageUploadState {
  file: File | null
  preview: string | null
  error: string | null
  isUploading: boolean
}

export interface CocktailApiResponse {
  drinks: Cocktail[] | null
}

export interface CocktailGridProps extends BaseProps {
  cocktails: CocktailWithIngredients[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
}

export interface CocktailCardProps extends BaseProps {
  cocktail: CocktailWithIngredients;
  onDelete?: () => void;
}

export interface RecipeHeaderProps extends BaseProps {
  name: string;
  glass?: string;
  category?: string;
  alcoholicType?: AlcoholicType;
  imageUrl?: string;
  lastModified?: Date;
}
