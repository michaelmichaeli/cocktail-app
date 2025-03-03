export interface CustomCocktail {
  id: string;
  name: string;
  instructions: string;
  imageUrl?: string;
  ingredients: Ingredient[];
  alcoholicType?: string;
  category?: string;
  glass?: string;
  tags: string[];
  dateModified: string;
  isCustom?: boolean;
}

export interface NewCustomCocktail extends Omit<CustomCocktail, 'id'> {
  imageFile?: File;
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

export interface ApiCocktail {
  idDrink: string;
  strDrink: string;
  strInstructions: string;
  strDrinkThumb: string;
  strAlcoholic: string;
  strCategory?: string;
  strGlass?: string;
  strTags?: string;
  dateModified?: string;
  [key: `strIngredient${number}`]: string | null;
  [key: `strMeasure${number}`]: string | null;
}

export interface CocktailApiResponse {
  drinks: ApiCocktail[] | null;
} 