import { useState, useEffect, useRef, useCallback } from "react";
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

export function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [displayedCocktails, setDisplayedCocktails] = useState<CustomCocktail[]>([]);
  const [cocktailToDelete, setCocktailToDelete] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const prevCocktailsRef = useRef<string>("");

  const searchQuery = searchParams.get("s") || "";

  const { 
    cocktails,
    isLoading,
    error, 
    deleteCustomCocktail,
    isDeletingCocktail
  } = useCocktails(searchQuery);

  useEffect(() => {
    const currentCocktails = JSON.stringify(cocktails);
    if (prevCocktailsRef.current !== currentCocktails) {
      setDisplayedCocktails(cocktails.slice(0, 8));
      setIsLoadingMore(false);
      prevCocktailsRef.current = currentCocktails;
    }
  }, [cocktails]);

  const lastCocktailElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading || !node) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && displayedCocktails.length < cocktails.length) {
        setIsLoadingMore(true);
        setTimeout(() => {
          // If we're close to the end, load all remaining items
          const remainingItems = cocktails.length - displayedCocktails.length;
          const itemsToLoad = Math.min(remainingItems, 5);
          
          if (remainingItems <= 5) {
            // Load all remaining items
            setDisplayedCocktails(cocktails);
          } else {
            // Load next batch
            const nextItems = cocktails.slice(
              displayedCocktails.length,
              displayedCocktails.length + itemsToLoad
            );
            setDisplayedCocktails(prev => [...prev, ...nextItems]);
          }
          setIsLoadingMore(false);
        }, 500);
      }
    }, {
      threshold: 0.1,
      rootMargin: '200px'
    });
    
    observer.current.observe(node);
  }, [cocktails, displayedCocktails.length, isLoading]);

  const renderCocktailCard = (cocktail: CustomCocktail, index: number) => (
    <div 
      key={cocktail.id}
      ref={index === displayedCocktails.length - 1 ? lastCocktailElementRef : undefined}
    >
      <CocktailCard 
        cocktail={cocktail}
        onDelete={cocktail.isCustom ? (id: string) => setCocktailToDelete(id) : undefined}
      />
    </div>
  );

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
      <header className="relative max-w-xl mx-auto z-10 space-y-6">
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
      </header>

      <main className="relative z-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? 
            Array.from({ length: 4 }).map((_, index) => (
              <CocktailCardSkeleton key={index} />
            ))
          : displayedCocktails.map((cocktail, index) => renderCocktailCard(cocktail, index))}
          
          {isLoadingMore && displayedCocktails.length < cocktails.length &&
            Array.from({ length: 5 }).map((_, index) => (
              <CocktailCardSkeleton key={`loading-more-${index}`} />
            ))
          }
        </div>

        {!isLoading && displayedCocktails.length === cocktails.length && cocktails.length > 0 && (
          <div className="text-center mt-8 text-base-content/70">
            ✨ End of Results ✨
          </div>
        )}

        {!isLoading && cocktails.length === 0 && (
          <EmptyState
            icon={<SearchX className="h-12 w-12 text-base-content/20" />}
            title="No Results Found"
            message={
              <div className="space-y-2">
                <p>No cocktails found matching "{searchQuery}"</p>
                <p>Try adjusting your search term or <Link to="/add" className="link link-primary">add your own custom cocktail</Link>.</p>
              </div>
            }
          />
        )}
      </main>

      <DeleteDialog
        isOpen={!!cocktailToDelete}
        onClose={() => {
          setCocktailToDelete(null);
        }}
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
