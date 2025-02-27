import { useState, useCallback, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SearchX, AlertCircle } from "lucide-react";
import { useCocktails } from "../hooks/useCocktails";
import { CocktailCard } from "../components/CocktailCard";
import { CocktailCardSkeleton } from "../components/CocktailCardSkeleton";
import { EmptyState } from "../components/EmptyState";
import { CustomCocktail } from "../types/cocktail";
import { DeleteDialog } from "../components/DeleteDialog";
import { showToast } from "../lib/toast";
import { ScrollToTop } from "../components/ScrollToTop";
import { FilterBar, FilterOptions } from "../components/FilterBar";

const FILTER_STORAGE_KEY = 'cocktail-filters';

export function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cocktailToDelete, setCocktailToDelete] = useState<string | null>(null);
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    const hasUrlParams = 
      searchParams.has("alcoholic") ||
      searchParams.has("category") ||
      searchParams.has("glass") ||
      searchParams.has("ingredients");

    if (!hasUrlParams) {
      const stored = sessionStorage.getItem(FILTER_STORAGE_KEY);
      if (!stored) return;

      try {
        const savedFilters = JSON.parse(stored);
        const hasFilters = (
          savedFilters.isAlcoholic !== null ||
          savedFilters.category !== undefined ||
          savedFilters.glass !== undefined ||
          (savedFilters.tags?.length || 0) > 0
        );

        if (hasFilters) {
          setSearchParams(current => {
            const newParams = new URLSearchParams(current);
            if (savedFilters.isAlcoholic !== null) {
              newParams.set("alcoholic", String(savedFilters.isAlcoholic));
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
        sessionStorage.removeItem(FILTER_STORAGE_KEY);
      }
    }
  }, [searchParams, setSearchParams]);
  
  const getFiltersFromParams = useCallback((): FilterOptions => {
    const isAlcoholic = searchParams.get("alcoholic");
    const category = searchParams.get("category");
    const glass = searchParams.get("glass");
    const ingredients = searchParams.get("ingredients");

    return {
      isAlcoholic: isAlcoholic === null ? null : isAlcoholic === "true",
      category: category ? decodeURIComponent(category) : undefined,
      glass: glass ? decodeURIComponent(glass) : undefined,
      tags: ingredients ? decodeURIComponent(ingredients).split(",").filter(Boolean) : [],
    };
  }, [searchParams]);

  const updateUrlParams = useCallback((filters: FilterOptions) => {
    sessionStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));

    setSearchParams(params => {
      const newParams = new URLSearchParams(params);

      newParams.delete("alcoholic");
      newParams.delete("category");
      newParams.delete("glass");
      newParams.delete("ingredients");

      if (filters.isAlcoholic !== null && filters.isAlcoholic !== undefined) {
        newParams.set("alcoholic", String(filters.isAlcoholic));
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

  const handleFilterChange = useCallback((filters: FilterOptions) => {
    updateUrlParams(filters);
  }, [updateUrlParams]);

  const currentFilters = useMemo(() => getFiltersFromParams(), [getFiltersFromParams]);

  const { 
    cocktails: unfilteredCocktails,
    isLoading,
    error, 
    deleteCustomCocktail,
    isDeletingCocktail
  } = useCocktails(searchQuery);

  const cocktails = useMemo(() => unfilteredCocktails.filter(cocktail => {
    if (currentFilters.isAlcoholic !== null && currentFilters.isAlcoholic !== undefined) {
      if (cocktail.isAlcoholic !== currentFilters.isAlcoholic) return false;
    }
    
    if (currentFilters.category) {
      if (cocktail.category !== currentFilters.category) return false;
    }
    
    if (currentFilters.glass) {
      if (cocktail.glass !== currentFilters.glass) return false;
    }
    
    if (currentFilters.tags && currentFilters.tags.length > 0) {
      const cocktailTags = cocktail.tags || [];
      if (!currentFilters.tags.some(tag => cocktailTags.includes(tag))) return false;
    }
    
    return true;
  }), [currentFilters, unfilteredCocktails]);

  const renderCocktailCard = useCallback((cocktail: CustomCocktail) => (
    <div 
      key={cocktail.id}
      className="transition-opacity duration-300 ease-in-out opacity-100"
    >
      <CocktailCard 
        cocktail={cocktail}
        onDelete={cocktail.isCustom ? (id: string) => setCocktailToDelete(id) : undefined}
      />
    </div>
  ), []);

  if (error) {
    return (
      <div className="container mx-auto px-6">
        <EmptyState
          icon={<AlertCircle className="h-12 w-12 text-error" />}
          title="Something went wrong"
          message="Failed to load cocktails. Please try again later."
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <header className="relative max-w-4xl mx-auto z-10 space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            Search Results for "{searchQuery}"
          </h1>
          {!isLoading && cocktails.length > 0 && (
            <p className="text-base-content/70">
              Found {cocktails.length} cocktail{cocktails.length === 1 ? '' : 's'}
            </p>
          )}
        </div>

        <FilterBar 
          initialFilters={currentFilters}
          onFilterChange={handleFilterChange}
        />
      </header>

      <main className="relative z-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <CocktailCardSkeleton key={index} />
            ))
          ) : cocktails.map(cocktail => renderCocktailCard(cocktail))}
        </div>

        {!isLoading && cocktails.length === 0 && (
          <EmptyState
            icon={<SearchX className="h-12 w-12 text-base-content/20" />}
            title="No Results Found"
            message={(
              <>
                <p>No cocktails found matching "{searchQuery}"</p>
                <p className="mt-2">
                  Try adjusting your search term or <Link to="/add" className="link link-primary">add your own custom cocktail</Link>.
                </p>
              </>
            )}
          />
        )}
      </main>

      <DeleteDialog
        isOpen={!!cocktailToDelete}
        onClose={() => setCocktailToDelete(null)}
        onConfirm={async () => {
          if (cocktailToDelete && !isDeletingCocktail) {
            await deleteCustomCocktail(cocktailToDelete);
            showToast("Cocktail deleted successfully", "success");
            setCocktailToDelete(null);
          }
        }}
        title="Delete Cocktail"
        message="Are you sure you want to delete this cocktail? This action cannot be undone."
      />

      <ScrollToTop />
    </div>
  );
}
