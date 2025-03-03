import { useQuery } from "@tanstack/react-query";
import { cocktailsApi } from "../api/cocktails";
import { useCustomCocktails } from "./useCustomCocktails";
import { Cocktail, CocktailWithIngredients } from "../types/features/cocktails";
import { FilterType, FilterConfig } from '../types/features/filters/index';

const filterConfigs: Record<FilterType, FilterConfig> = {
  ingredient: {
    fetch: cocktailsApi.getCocktailsByIngredient,
    matchCustom: (cocktail, value) => 
      cocktail.ingredients?.some(ing => 
        ing.name.toLowerCase().includes(value.toLowerCase())
      ) || false
  },
  glass: {
    fetch: cocktailsApi.getCocktailsByGlass,
    matchCustom: (cocktail, value) => 
      (cocktail.glass?.toLowerCase() || '') === value.toLowerCase()
  },
  category: {
    fetch: cocktailsApi.getCocktailsByCategory,
    matchCustom: (cocktail, value) => 
      (cocktail.category?.toLowerCase() || '') === value.toLowerCase()
  }
};

const mapApiCocktailToCommon = (c: Cocktail): CocktailWithIngredients => {
  const ingredients = [];
  for (let i = 1; i <= 15; i++) {
    const name = c[`strIngredient${i}`];
    const amount = c[`strMeasure${i}`];
    if (name) {
      ingredients.push({
        name,
        amount: amount || '',
        unitOfMeasure: ''
      });
    }
  }

  return {
    id: c.idDrink,
    name: c.strDrink,
    instructions: c.strInstructions || '',
    imageUrl: c.strDrinkThumb,
    ingredients,
    alcoholicType: c.strAlcoholic,
    category: c.strCategory,
    glass: c.strGlass,
    tags: c.strTags?.split(',').map(tag => tag.trim()) || [],
    dateModified: c.dateModified || new Date().toISOString()
  };
};

export function useFilteredCocktails(type: FilterType, value: string) {
  const { cocktails: customCocktails, isLoading: isLoadingCustom } = useCustomCocktails();
  
  const { data: apiCocktails = [], isLoading: isLoadingApi, error } = useQuery({
    queryKey: [type, value],
    queryFn: async () => {
      if (!value) return [];
      const apiCocktails = await filterConfigs[type].fetch(value);
      return apiCocktails.map(mapApiCocktailToCommon);
    },
    enabled: !!value,
  });

  const filteredCustomCocktails = value
    ? customCocktails.filter(cocktail => 
        filterConfigs[type].matchCustom(cocktail, value)
      )
    : [];

  const mergedCocktails = [...filteredCustomCocktails, ...apiCocktails];

  return {
    cocktails: mergedCocktails,
    isLoading: isLoadingApi || isLoadingCustom,
    error: error instanceof Error ? error : error ? new Error('Failed to load cocktails') : null
  };
}
