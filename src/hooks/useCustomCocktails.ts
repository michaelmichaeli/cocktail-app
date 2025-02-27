import { useQuery } from "@tanstack/react-query";
import { storage } from "../lib/storage";

export function useCustomCocktails() {
  const { data: customCocktails = [], isLoading } = useQuery({
    queryKey: ["customCocktails"],
    queryFn: storage.getCustomCocktails,
    staleTime: 0
  });

  const cocktails = customCocktails.map(c => ({ ...c, isCustom: true }));

  return {
    cocktails,
    isLoading
  };
}
