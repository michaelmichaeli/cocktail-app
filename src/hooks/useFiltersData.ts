import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export function useFiltersData() {
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.getCategories(),
    staleTime: 60 * 60 * 1000, // 1 hour
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const { data: glasses = [], isLoading: isLoadingGlasses } = useQuery({
    queryKey: ["glasses"],
    queryFn: () => api.getGlasses(),
    staleTime: 60 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const { data: ingredients = [], isLoading: isLoadingIngredients } = useQuery({
    queryKey: ["ingredients"],
    queryFn: () => api.getIngredients(),
    staleTime: 60 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    categories,
    glasses,
    ingredients,
    isLoading: isLoadingCategories || isLoadingGlasses || isLoadingIngredients,
  };
}
