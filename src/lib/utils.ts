import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Cocktail, CustomCocktail, Ingredient, AlcoholicType } from "../types/features/cocktails";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export const getRandomItems = <T>(array: T[], count: number): T[] => {
  const available = [...array];
  const result = [];
  for (let i = 0; i < count && available.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * available.length);
    result.push(available.splice(randomIndex, 1)[0]);
  }
  return result;
};

const parseMeasurement = (measure: string = ""): { amount: string; unitOfMeasure: string } => {
  const match = measure.trim().match(/^([\d./\s]+)?\s*(.*)$/);
  return {
    amount: (match?.[1] || "").trim(),
    unitOfMeasure: (match?.[2] || "").trim(),
  };
};

export const formatApiCocktail = (c: Cocktail): CustomCocktail => {
  const ingredients: Ingredient[] = [];
  let i = 1;
  
  while (true) {
    const ingredient = c[`strIngredient${i}` as keyof typeof c];
    if (!ingredient) break;
    
    const measure = c[`strMeasure${i}` as keyof typeof c] || "";
    const { amount, unitOfMeasure } = parseMeasurement(measure);
    
    ingredients.push({
      name: ingredient,
      amount,
      unitOfMeasure
    });
    i++;
  }

  return {
    id: c.idDrink,
    name: c.strDrink,
    instructions: c.strInstructions,
    imageUrl: c.strDrinkThumb,
    ingredients,
    tags: c.strTags?.split(',').map(tag => tag.trim()) || [],
    category: c.strCategory,
    glass: c.strGlass,
    alcoholicType: Object.values(AlcoholicType).find(t => t === c.strAlcoholic),
    dateModified: c.dateModified || new Date().toISOString()
  };
};
