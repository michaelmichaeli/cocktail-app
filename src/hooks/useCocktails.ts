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
    ingredients
  };
};

export function useCocktails(searchQuery: string = "") {
  const queryClient = useQueryClient();

  const { data: apiCocktails = [], isLoading: isLoadingApi, error: apiError } = useQuery({
    queryKey: ["cocktails", searchQuery],
    queryFn: () => api.searchCocktails(searchQuery)
  });

  const { data: randomCocktail, isLoading: isLoadingRandom } = useQuery({
    queryKey: ["randomCocktail"],
    queryFn: () => api.getRandomCocktail(),
    enabled: apiCocktails.length === 0 && searchQuery !== ""
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

  // Filter custom cocktails based on search query
  const filteredCustomCocktails = customCocktails.filter(c => 
    searchQuery ? c.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  // Format API cocktails
  const formattedApiCocktails = apiCocktails.map(formatApiCocktail);

  // Add random cocktail if search has no results
  const randomCocktails = randomCocktail && apiCocktails.length === 0 && searchQuery
    ? [formatApiCocktail(randomCocktail)]
    : [];

  // Combine all results
  const cocktails = [
    ...filteredCustomCocktails.map(c => ({ ...c, isCustom: true })),
    ...formattedApiCocktails,
    ...randomCocktails
  ];

  return {
    cocktails,
    isLoading: isLoadingApi || isLoadingCustom || isLoadingRandom,
    error: apiError,
    addCustomCocktail: addCustomCocktailMutation.mutateAsync,
    deleteCustomCocktail: deleteCustomCocktailMutation.mutateAsync,
    isAddingCocktail: addCustomCocktailMutation.isPending,
    isDeletingCocktail: deleteCustomCocktailMutation.isPending
  };
}
