export interface Ingredient {
  name: string;
  amount: string;
  unitOfMeasure: string;
}

export interface Cocktail {
  idDrink: string;
  strDrink: string;
  strInstructions: string;
  strDrinkThumb: string;
  strTags?: string;
  strCategory?: string;
  strGlass?: string;
  strAlcoholic?: string;
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
  tags: string[];
  category: string;
  glass: string;
  isAlcoholic: boolean;
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
