import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { storage } from "../lib/storage";
import { formatApiCocktail } from "../lib/utils";
import { showToast } from "../lib/toast";

export function useSearchCocktails(searchQuery: string = "") {
  const { data: apiCocktails = [], isLoading: isLoadingApi, error: apiError } = useQuery({
    queryKey: ["cocktails", searchQuery],
    queryFn: () => api.searchCocktails(searchQuery),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const { data: customCocktails = [], isLoading: isLoadingCustom } = useQuery({
    queryKey: ["customCocktails"],
    queryFn: storage.getCustomCocktails,
    staleTime: 0
  });

  const filteredCustomCocktails = customCocktails.filter(c => 
    searchQuery ? c.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  const cocktails = [
    ...filteredCustomCocktails.map(c => ({ ...c, isCustom: true })),
    ...apiCocktails.map(formatApiCocktail)
  ];

  const queryClient = useQueryClient();

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

  return {
    cocktails,
    isLoading: isLoadingApi || isLoadingCustom,
    error: apiError,
    deleteCustomCocktail: deleteCustomCocktailMutation.mutateAsync,
    isDeletingCocktail: deleteCustomCocktailMutation.isPending
  };
}
