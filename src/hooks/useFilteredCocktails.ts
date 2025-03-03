import { useQuery } from "@tanstack/react-query";
import { cocktailsApi } from "../api/cocktails";
import { useCustomCocktails } from "./useCustomCocktails";
import { ApiCocktail, CustomCocktail } from "../types/features/cocktails";
import { FilterType, FilterConfig } from '../types/features/filters/index';
import { filterIcons } from '../components/FilterIcon';

const hasIngredient = (cocktail: CustomCocktail, searchTerm: string): boolean => 
  cocktail.ingredients.some(ingredient => 
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

const matchesGlassType = (cocktail: CustomCocktail, glassType: string): boolean => 
  cocktail.glass?.toLowerCase() === glassType.toLowerCase();

const matchesCategory = (cocktail: CustomCocktail, category: string): boolean => 
  cocktail.category?.toLowerCase() === category.toLowerCase();

const filterConfigs: Record<FilterType, FilterConfig> = {
  ingredient: {
    title: "Ingredient",
    icon: filterIcons.ingredient,
    param: "i",
    fetch: cocktailsApi.getCocktailsByIngredient,
    matchCustom: hasIngredient
  },
  glass: {
    title: "Glass",
    icon: filterIcons.glass,
    param: "g",
    fetch: cocktailsApi.getCocktailsByGlass,
    matchCustom: matchesGlassType
  },
  category: {
    title: "Category",
    icon: filterIcons.category,
    param: "c",
    fetch: cocktailsApi.getCocktailsByCategory,
    matchCustom: matchesCategory
  }
};

const mapApiCocktailToCommon = (c: ApiCocktail): CustomCocktail => {
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
    tags: c.strTags?.split(',').map((tag: string) => tag.trim()) || [],
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
