import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { formatApiCocktail, getRandomItems } from "../lib/utils";

export function useHomePageCocktails() {
  const { data: randomCocktails = [], isLoading: isLoadingRandom, error: randomError } = useQuery({
    queryKey: ["randomCocktails"],
    queryFn: async () => {
      const cocktails = [];
      for (let i = 0; i < 4; i++) {
        const result = await api.getRandomCocktail();
        if (result) cocktails.push(result);
      }
      return cocktails.map(formatApiCocktail);
    },
    staleTime: 60 * 60 * 1000, // 1 hour
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
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    randomCocktails,
    nonAlcoholicCocktails,
    isLoading: isLoadingRandom || isLoadingNonAlcoholic,
    error: randomError,
  };
}
