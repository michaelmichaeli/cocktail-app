import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useFiltersStore } from "../store/useFiltersStore";
import { useCustomCocktails } from "./useCustomCocktails";
import { formatApiCocktail, getRandomItem, getRandomItems } from "../lib/utils";
import { useState, useEffect } from "react";

export function useHomePageCocktails() {
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [selectedGlass, setSelectedGlass] = useState<string>();
  const [selectedIngredient, setSelectedIngredient] = useState<string>();

  const { categories, glasses, ingredients } = useFiltersStore();

  useEffect(() => {
    if (categories.length && !selectedCategory) {
      setSelectedCategory(getRandomItem(categories));
    }
    if (glasses.length && !selectedGlass) {
      setSelectedGlass(getRandomItem(glasses));
    }
    if (ingredients.length && !selectedIngredient) {
      setSelectedIngredient(getRandomItem(ingredients));
    }
  }, [categories, glasses, ingredients]);

  const { data: randomCocktails = [], isLoading: isLoadingRandom, error: randomError } = useQuery({
    queryKey: ["randomCocktails"],
    queryFn: async () => {
      const cocktails = [];
      for (let i = 0; i < 4; i++) {
        const result = await api.getRandomCocktail();
        if (result) cocktails.push(formatApiCocktail(result));
      }
      return cocktails;
    },
    staleTime: 60 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const { data: nonAlcoholicCocktails = [], isLoading: isLoadingNonAlcoholic } = useQuery({
    queryKey: ["nonAlcoholicCocktails"],
    queryFn: async () => {
      const result = await api.getNonAlcoholicCocktails();
      return getRandomItems(result, 4).map(formatApiCocktail);
    },
    staleTime: 60 * 60 * 1000,
  });

  const { data: categoryCocktails = [], isLoading: isLoadingCategory } = useQuery({
    queryKey: ["categoryCocktails", selectedCategory],
    queryFn: async () => {
      if (!selectedCategory) return [];
      const result = await api.getCocktailsByCategory(selectedCategory);
      return getRandomItems(result, 4).map(formatApiCocktail);
    },
    enabled: !!selectedCategory,
    staleTime: 60 * 60 * 1000,
  });

  const { data: glassCocktails = [], isLoading: isLoadingGlass } = useQuery({
    queryKey: ["glassCocktails", selectedGlass],
    queryFn: async () => {
      if (!selectedGlass) return [];
      const result = await api.getCocktailsByGlass(selectedGlass);
      return getRandomItems(result, 4).map(formatApiCocktail);
    },
    enabled: !!selectedGlass,
    staleTime: 60 * 60 * 1000,
  });

  const { data: ingredientCocktails = [], isLoading: isLoadingIngredient } = useQuery({
    queryKey: ["ingredientCocktails", selectedIngredient],
    queryFn: async () => {
      if (!selectedIngredient) return [];
      const result = await api.getCocktailsByIngredient(selectedIngredient);
      return getRandomItems(result, 4).map(formatApiCocktail);
    },
    enabled: !!selectedIngredient,
    staleTime: 60 * 60 * 1000,
  });

  const { cocktails: customCocktails, isLoading: isLoadingCustom } = useCustomCocktails();

  return {
    randomCocktails,
    nonAlcoholicCocktails,
    customCocktails: customCocktails.slice(0, 4),
    categoryCocktails,
    glassCocktails,
    ingredientCocktails,
    selectedCategory,
    selectedGlass,
    selectedIngredient,
    isLoading: 
      isLoadingRandom || 
      isLoadingNonAlcoholic || 
      isLoadingCategory || 
      isLoadingGlass || 
      isLoadingIngredient || 
      isLoadingCustom,
    error: randomError
  };
}
