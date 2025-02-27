import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { storage } from "../lib/storage";
import { showToast } from "../lib/toast";
import { getRandomItem, getRandomItems } from "../lib/utils";
import { Cocktail, CustomCocktail, CocktailWithIngredients, Ingredient } from "../types/cocktail";

const parseMeasurement = (measure: string = ""): { amount: string; unitOfMeasure: string } => {
  const match = measure.trim().match(/^([\d./\s]+)?\s*(.*)$/);
  return {
    amount: (match?.[1] || "").trim(),
    unitOfMeasure: (match?.[2] || "").trim(),
  };
};

const formatApiCocktail = (c: Cocktail): CocktailWithIngredients => {
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
    isAlcoholic: c.strAlcoholic?.toLowerCase().includes('alcoholic') ?? undefined,
    dateModified: c.dateModified || new Date().toISOString()
  };
};

export function useCocktails(initialSearchQuery: string = "") {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || initialSearchQuery;
  const categoryParam = searchParams.get('c');
  const glassParam = searchParams.get('g');
  const ingredientParam = searchParams.get('i');

  const { data: apiCocktails = [], isLoading: isLoadingApi, error: apiError } = useQuery({
    queryKey: ["cocktails", searchQuery],
    queryFn: () => api.searchCocktails(searchQuery),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const { data: randomCocktails = [], isLoading: isLoadingRandom, error: randomError } = useQuery({
    queryKey: ["randomCocktails"],
    queryFn: async () => {
      const cocktails = [];
      for (let i = 0; i < 4; i++) {
        const result = await api.getRandomCocktail();
        if (result) cocktails.push(result);
      }
      return cocktails;
    },
    enabled: !searchQuery,
    staleTime: 60 * 60 * 1000, // 1 hour
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.getCategories(),
    staleTime: 60 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const { data: glasses = [] } = useQuery({
    queryKey: ["glasses"],
    queryFn: () => api.getGlasses(),
    staleTime: 60 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const { data: ingredients = [] } = useQuery({
    queryKey: ["ingredients"],
    queryFn: () => api.getIngredients(),
    staleTime: 60 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });


  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(categoryParam || undefined);
  const [selectedGlass, setSelectedGlass] = useState<string | undefined>(glassParam || undefined);
  const [selectedIngredient, setSelectedIngredient] = useState<string | undefined>(ingredientParam || undefined);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory) params.set('c', selectedCategory);
    if (selectedGlass) params.set('g', selectedGlass);
    if (selectedIngredient) params.set('i', selectedIngredient);
    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedCategory, selectedGlass, selectedIngredient]);

  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
    if (glassParam) setSelectedGlass(glassParam);
    if (ingredientParam) setSelectedIngredient(ingredientParam);
  }, [categoryParam, glassParam, ingredientParam]);

  useEffect(() => {
    const hasNoFilters = !categoryParam && !glassParam && !ingredientParam && !searchQuery;
    if (hasNoFilters) {
      if (categories.length && !selectedCategory) {
        setSelectedCategory(getRandomItem(categories));
      }
      if (glasses.length && !selectedGlass) {
        setSelectedGlass(getRandomItem(glasses));
      }
      if (ingredients.length && !selectedIngredient) {
        setSelectedIngredient(getRandomItem(ingredients));
      }
    }
  }, [categories, glasses, ingredients, categoryParam, glassParam, ingredientParam, searchQuery]);

  const { data: nonAlcoholicCocktails = [], isLoading: isLoadingNonAlcoholic, error: nonAlcoholicError } = useQuery({
    queryKey: ["nonAlcoholicCocktails"],
    queryFn: async () => {
      const result = await api.getNonAlcoholicCocktails();
      return result.length ? getRandomItems(result, 4) : [];
    },
    staleTime: 60 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const { data: categoryCocktails = [], isLoading: isLoadingCategory, error: categoryError } = useQuery({
    queryKey: ["categoryCocktails", selectedCategory],
    queryFn: async () => {
      if (!selectedCategory) return [];
      const result = await api.getCocktailsByCategory(selectedCategory);
      // Only limit results on homepage
      return categoryParam ? result : getRandomItems(result, 4);
    },
    enabled: !!selectedCategory,
    staleTime: 60 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const { data: glassCocktails = [], isLoading: isLoadingGlass, error: glassError } = useQuery({
    queryKey: ["glassCocktails", selectedGlass],
    queryFn: async () => {
      if (!selectedGlass) return [];
      const result = await api.getCocktailsByGlass(selectedGlass);
      return glassParam ? result : getRandomItems(result, 4);
    },
    enabled: !!selectedGlass,
    staleTime: 60 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const { data: ingredientCocktails = [], isLoading: isLoadingIngredient, error: ingredientError } = useQuery({
    queryKey: ["ingredientCocktails", selectedIngredient],
    queryFn: async () => {
      if (!selectedIngredient) return [];
      const result = await api.getCocktailsByIngredient(selectedIngredient);
      return ingredientParam ? result : getRandomItems(result, 4);
    },
    enabled: !!selectedIngredient,
    staleTime: 60 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const { data: customCocktails = [], isLoading: isLoadingCustom } = useQuery({
    queryKey: ["customCocktails"],
    queryFn: storage.getCustomCocktails,
    staleTime: 0
  });

  const addCustomCocktailMutation = useMutation({
    mutationFn: (cocktail: Omit<CustomCocktail, "id">) => storage.addCustomCocktail(cocktail),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customCocktails"] });
    },
    onError: (error) => {
      showToast("Failed to save cocktail: " + error, "error");
    }
  });

  const deleteCustomCocktailMutation = useMutation({
    mutationFn: storage.deleteCustomCocktail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customCocktails"] });
      showToast("Cocktail deleted successfully", "success");
    },
    onError: (error) => {
      showToast("Failed to delete cocktail: " + error, "error");
    }
  });

  const filteredCustomCocktails = customCocktails.filter(c => 
    searchQuery ? c.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  const formattedApiCocktails = apiCocktails.map(formatApiCocktail);
  const randomSuggestions = randomCocktails.map(formatApiCocktail);

  const cocktails = [
    ...filteredCustomCocktails.map(c => ({ ...c, isCustom: true })),
    ...formattedApiCocktails
  ];

  return {
    cocktails,
    randomSuggestions,
    isLoading: isLoadingApi || isLoadingCustom,
    isLoadingRandomSuggestions: isLoadingRandom,
    randomError,
    error: apiError,
    addCustomCocktail: addCustomCocktailMutation.mutateAsync,
    deleteCustomCocktail: deleteCustomCocktailMutation.mutateAsync,
    isAddingCocktail: addCustomCocktailMutation.isPending,
    isDeletingCocktail: deleteCustomCocktailMutation.isPending,
    
    customCocktails: customCocktails.map(c => ({ ...c, isCustom: true })),
    isLoadingCustomCocktails: isLoadingCustom,

    nonAlcoholicCocktails: nonAlcoholicCocktails.map(formatApiCocktail),
    isLoadingNonAlcoholic,
    nonAlcoholicError,

    ingredientCocktails: ingredientCocktails.map(formatApiCocktail),
    isLoadingIngredient,
    ingredientError,
    selectedIngredient,

    categoryCocktails: categoryCocktails.map(formatApiCocktail),
    isLoadingCategory,
    categoryError,
    selectedCategory,

    glassCocktails: glassCocktails.map(formatApiCocktail),
    isLoadingGlass,
    glassError,
    selectedGlass
  };
}
