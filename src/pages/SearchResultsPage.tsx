import { useState, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { SearchX, AlertCircle } from "lucide-react";
import { useCocktails } from "../hooks/useCocktails";
import { CocktailCard } from "../components/CocktailCard";
import { CocktailCardSkeleton } from "../components/CocktailCardSkeleton";
import { EmptyState } from "../components/EmptyState";
import { CustomCocktail } from "../types/cocktail";
import { DeleteDialog } from "../components/DeleteDialog";
import { showToast } from "../lib/toast";
import { ScrollToTop } from "../components/ScrollToTop";
import { SearchInput } from "../components/SearchInput";
import { FilterBar, FilterOptions } from "../components/FilterBar";

export function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cocktailToDelete, setCocktailToDelete] = useState<string | null>(null);

  const searchQuery = searchParams.get("s") || "";

  const [activeFilters, setActiveFilters] = useState<FilterOptions>({});

  const { 
    cocktails: unfilteredCocktails,
    isLoading,
    error, 
    deleteCustomCocktail,
    isDeletingCocktail
  } = useCocktails(searchQuery);

  const cocktails = unfilteredCocktails.filter(cocktail => {
    if (activeFilters.isAlcoholic !== null && activeFilters.isAlcoholic !== undefined) {
      if (cocktail.isAlcoholic !== activeFilters.isAlcoholic) return false;
    }
    
    if (activeFilters.category) {
      if (cocktail.category !== activeFilters.category) return false;
    }
    
    if (activeFilters.glass) {
      if (cocktail.glass !== activeFilters.glass) return false;
    }
    
    if (activeFilters.tags && activeFilters.tags.length > 0) {
      const cocktailTags = cocktail.tags || [];
      if (!activeFilters.tags.some(tag => cocktailTags.includes(tag))) return false;
    }
    
    return true;
  });

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
        <SearchInput 
          initialValue={searchQuery}
          onSearch={(query) => setSearchParams({ s: query })}
        />

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

        <FilterBar onFilterChange={setActiveFilters} />
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
