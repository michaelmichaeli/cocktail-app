import { useMutation, useQueryClient } from "@tanstack/react-query";
import { storage } from "../lib/storage";
import { toast } from "../lib/toast";
import type { NewCustomCocktail } from "../types/features/cocktails";

export function useAddCocktail() {
  const queryClient = useQueryClient();

  const { mutateAsync: addCustomCocktail, isPending: isAddingCocktail } = useMutation({
    mutationFn: (cocktail: NewCustomCocktail) => storage.addCustomCocktail(cocktail),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customCocktails"] });
    },
    onError: (error) => {
      toast.error("Failed to save cocktail: " + error);
    }
  });

  return {
    addCustomCocktail,
    isAddingCocktail,
  };
}
