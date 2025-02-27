import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { storage } from "../lib/storage";

export function useCustomCocktails() {
  const queryClient = useQueryClient();

  const { data: customCocktails = [], isLoading } = useQuery({
    queryKey: ["customCocktails"],
    queryFn: storage.getCustomCocktails,
    staleTime: 0
  });

  const deleteMutation = useMutation({
    mutationFn: storage.deleteCustomCocktail,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['customCocktails'] });
    }
  });

  const cocktails = customCocktails.map(c => ({ ...c, isCustom: true }));

  return {
    cocktails,
    isLoading,
    deleteCustomCocktail: deleteMutation.mutate,
    isDeletingCocktail: deleteMutation.isPending
  };
}
