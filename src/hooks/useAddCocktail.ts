import { useMutation, useQueryClient } from "@tanstack/react-query";
import { storage } from "../lib/storage";
import { showToast } from "../lib/toast";
import type { CustomCocktail } from "../types/cocktail";

export function useAddCocktail() {
  const queryClient = useQueryClient();

  const { mutateAsync: addCustomCocktail, isPending: isAddingCocktail } = useMutation({
    mutationFn: (cocktail: Omit<CustomCocktail, "id">) => storage.addCustomCocktail(cocktail),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customCocktails"] });
    },
    onError: (error) => {
      showToast("Failed to save cocktail: " + error, "error");
    }
  });

  return {
    addCustomCocktail,
    isAddingCocktail,
  };
}
