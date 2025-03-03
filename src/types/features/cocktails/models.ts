export interface CocktailWithIngredients {
  id: string;
  name: string;
  instructions: string;
  imageUrl: string;
  ingredients: Ingredient[];
  alcoholicType: string;
  category?: string;
  glass?: string;
  tags: string[];
  dateModified: string;
  isCustom?: boolean;
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