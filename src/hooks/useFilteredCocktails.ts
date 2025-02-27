import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useCustomCocktails } from "./useCustomCocktails";
import { Cocktail, CocktailWithIngredients } from "../types/cocktail";

export type FilterType = 'ingredient' | 'glass' | 'category';

interface FilterConfig {
  fetch: (value: string) => Promise<Cocktail[]>;
  matchCustom: (cocktail: CocktailWithIngredients, value: string) => boolean;
}

const filterConfigs: Record<FilterType, FilterConfig> = {
  ingredient: {
    fetch: api.getCocktailsByIngredient,
    matchCustom: (cocktail, value) => 
      cocktail.ingredients.some(ing => 
        ing.name.toLowerCase().includes(value.toLowerCase())
      )
  },
  glass: {
    fetch: api.getCocktailsByGlass,
    matchCustom: (cocktail, value) => 
      (cocktail.glass?.toLowerCase() || '') === value.toLowerCase()
  },
  category: {
    fetch: api.getCocktailsByCategory,
    matchCustom: (cocktail, value) => 
      (cocktail.category?.toLowerCase() || '') === value.toLowerCase()
  }
};

const mapApiCocktailToCommon = (c: Cocktail): CocktailWithIngredients => {
  const ingredients = [];
  // API provides up to 15 ingredients
  for (let i = 1; i <= 15; i++) {
    const name = c[`strIngredient${i}`];
    const amount = c[`strMeasure${i}`];
    if (name) {
      ingredients.push({
        name,
        amount: amount || '',
        unitOfMeasure: ''  // API doesn't separate unit from amount
      });
    }
  }

  return {
    id: c.idDrink,
    name: c.strDrink,
    instructions: c.strInstructions || '',
    imageUrl: c.strDrinkThumb,
    ingredients,
    isAlcoholic: c.strAlcoholic?.toLowerCase().includes('alcoholic') ?? undefined,
    category: c.strCategory,
    glass: c.strGlass,
    tags: c.strTags?.split(',').map(tag => tag.trim()) || [],
    dateModified: c.dateModified || new Date().toISOString()
  };
};

export function useFilteredCocktails(type: FilterType, filterValue: string) {
  const { cocktails: customCocktails, isLoading: isLoadingCustom } = useCustomCocktails();
  
  const { data: apiCocktails = [], isLoading: isLoadingApi, error } = useQuery({
    queryKey: [type, filterValue],
    queryFn: async () => {
      if (!filterValue) return [];
      const apiCocktails = await filterConfigs[type].fetch(filterValue);
      return apiCocktails.map(mapApiCocktailToCommon);
    },
    enabled: !!filterValue,
  });

  const filteredCustomCocktails = filterValue
    ? customCocktails.filter(cocktail => 
        filterConfigs[type].matchCustom(cocktail, filterValue)
      )
    : [];

  // Always show custom cocktails first
  const mergedCocktails = [...filteredCustomCocktails, ...apiCocktails];

  return {
    cocktails: mergedCocktails,
    isLoading: isLoadingApi || isLoadingCustom,
    error: error instanceof Error ? error : error ? new Error('Failed to load cocktails') : null
  };
}
