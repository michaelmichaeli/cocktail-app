import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { cocktailsApi } from "../api/cocktails";
import { storage } from "../lib/storage";
import { formatApiCocktail } from "../lib/utils";
import { toast } from "../lib/toast";
import type { FilterOptions } from "../types/features/filters";
import type { AlcoholicType } from "../types/features/cocktails";

export function useSearchCocktails(initialSearchQuery: string = "") {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || initialSearchQuery;
  const { data: apiCocktails = [], isLoading: isLoadingApi, error: apiError } = useQuery({
    queryKey: ["cocktails", searchQuery],
    queryFn: () => cocktailsApi.searchCocktails(searchQuery),
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
      toast.success("Cocktail deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete cocktail: " + error);
    }
  });

  const getFiltersFromParams = useCallback((): FilterOptions => {
    const alcoholicType = searchParams.get("alcoholicType");
    const category = searchParams.get("category");
    const glass = searchParams.get("glass");
    const ingredients = searchParams.get("ingredients");

    return {
      alcoholicType: alcoholicType ? decodeURIComponent(alcoholicType) as AlcoholicType : null,
      category: category ? decodeURIComponent(category) : undefined,
      glass: glass ? decodeURIComponent(glass) : undefined,
      tags: ingredients ? decodeURIComponent(ingredients).split(",").filter(Boolean) : [],
    };
  }, [searchParams]);

  const currentFilters = useMemo(() => getFiltersFromParams(), [getFiltersFromParams]);

  useEffect(() => {
    const loadFilters = async () => {
      const hasUrlParams = 
        searchParams.has("alcoholicType") ||
        searchParams.has("category") ||
        searchParams.has("glass") ||
        searchParams.has("ingredients");

      if (!hasUrlParams) {
        try {
          const savedFilters = await storage.getFilters();
          if (!savedFilters) return;

          const hasFilters = (
            savedFilters.alcoholicType !== null ||
            savedFilters.category !== undefined ||
            savedFilters.glass !== undefined ||
            (savedFilters.tags?.length || 0) > 0
          );

          if (hasFilters) {
            setSearchParams(current => {
              const newParams = new URLSearchParams(current);
              if (savedFilters.alcoholicType) {
                newParams.set("alcoholicType", encodeURIComponent(savedFilters.alcoholicType));
              }
              if (savedFilters.category) {
                newParams.set("category", encodeURIComponent(savedFilters.category));
              }
              if (savedFilters.glass) {
                newParams.set("glass", encodeURIComponent(savedFilters.glass));
              }
              if (savedFilters.tags?.length) {
                newParams.set("ingredients", encodeURIComponent(savedFilters.tags.join(",")));
              }
              return newParams;
            }, { replace: true });
          }
        } catch {
          await storage.clearFilters();
        }
      }
    };

    loadFilters();
  }, [searchParams, setSearchParams]);

  const updateFilters = useCallback(async (filters: FilterOptions) => {
    await storage.saveFilters(filters);

    setSearchParams(params => {
      const newParams = new URLSearchParams(params);

      newParams.delete("alcoholicType");
      newParams.delete("category");
      newParams.delete("glass");
      newParams.delete("ingredients");

      if (filters.alcoholicType) {
        newParams.set("alcoholicType", encodeURIComponent(filters.alcoholicType));
      }
      if (filters.category) {
        newParams.set("category", encodeURIComponent(filters.category));
      }
      if (filters.glass) {
        newParams.set("glass", encodeURIComponent(filters.glass));
      }
      if (filters.tags?.length) {
        newParams.set("ingredients", encodeURIComponent(filters.tags.join(",")));
      }

      return newParams;
    }, { replace: true });
  }, [setSearchParams]);

  const filteredCocktails = useMemo(() => cocktails.filter(cocktail => {
    if (currentFilters.alcoholicType) {
      if (cocktail.alcoholicType !== currentFilters.alcoholicType) return false;
    }
    
    if (currentFilters.category) {
      if (cocktail.category !== currentFilters.category) return false;
    }
    
    if (currentFilters.glass) {
      if (cocktail.glass !== currentFilters.glass) return false;
    }
    
    if (currentFilters.tags && currentFilters.tags.length > 0) {
      const cocktailTags = cocktail.tags || [];
      if (!currentFilters.tags.some((tag: string) => cocktailTags.includes(tag))) return false;
    }
    
    return true;
  }), [currentFilters, cocktails]);

  return {
    cocktails: filteredCocktails,
    isLoading: isLoadingApi || isLoadingCustom,
    error: apiError,
    deleteCustomCocktail: deleteCustomCocktailMutation.mutateAsync,
    isDeletingCocktail: deleteCustomCocktailMutation.isPending,
    currentFilters,
    updateFilters
  };
}
