import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { storage } from "../lib/storage";
import { showToast } from "../lib/toast";
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

export function useCocktails(searchQuery: string = "") {
  const queryClient = useQueryClient();

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

  const randomCategory = categories[0];
  const randomGlass = glasses[0];
  const randomIngredient = ingredients[0];

  const { data: nonAlcoholicCocktails = [], isLoading: isLoadingNonAlcoholic, error: nonAlcoholicError } = useQuery({
    queryKey: ["nonAlcoholicCocktails"],
    queryFn: async () => {
      const result = await api.getNonAlcoholicCocktails();
      return result;
    },
    staleTime: 60 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const { data: categoryCocktails = [], isLoading: isLoadingCategory, error: categoryError } = useQuery({
    queryKey: ["categoryCocktails", randomCategory],
    queryFn: async () => {
      if (!randomCategory) return [];
      const result = await api.getCocktailsByCategory(randomCategory);
      return result;
    },
    enabled: !!randomCategory,
    staleTime: 60 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const { data: glassCocktails = [], isLoading: isLoadingGlass, error: glassError } = useQuery({
    queryKey: ["glassCocktails", randomGlass],
    queryFn: async () => {
      if (!randomGlass) return [];
      const result = await api.getCocktailsByGlass(randomGlass);
      return result;
    },
    enabled: !!randomGlass,
    staleTime: 60 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const { data: ingredientCocktails = [], isLoading: isLoadingIngredient, error: ingredientError } = useQuery({
    queryKey: ["ingredientCocktails", randomIngredient],
    queryFn: async () => {
      if (!randomIngredient) return [];
      const result = await api.getCocktailsByIngredient(randomIngredient);
      return result;
    },
    enabled: !!randomIngredient,
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
    selectedIngredient: randomIngredient,

    categoryCocktails: categoryCocktails.map(formatApiCocktail),
    isLoadingCategory,
    categoryError,
    selectedCategory: randomCategory,

    glassCocktails: glassCocktails.map(formatApiCocktail),
    isLoadingGlass,
    glassError,
    selectedGlass: randomGlass,
  };
}
