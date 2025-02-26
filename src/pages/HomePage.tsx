import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Trash2, SearchX, AlertCircle } from "lucide-react";
import { useCocktails } from "../hooks/useCocktails";
import { CocktailCardSkeletonGrid } from "../components/CocktailCardSkeleton";
import { EmptyState } from "../components/EmptyState";
import { CustomCocktail } from "../types/cocktail";
import { DeleteDialog } from "../components/DeleteDialog";
import { showToast } from "../lib/toast";
import { KeyboardShortcuts } from "../components/KeyboardShortcuts";
import { ScrollToTop } from "../components/ScrollToTop";

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [cocktailToDelete, setCocktailToDelete] = useState<string | null>(null);
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInputElement = 
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable);

      const hasModifierKey = e.ctrlKey || e.metaKey || e.altKey;
      const isDialogOpen = document.querySelector('.modal-open');

      if (isInputElement || hasModifierKey || isDialogOpen) {
        return;
      }

      if (e.key === "/" || e.key === "s") {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === "n") {
        e.preventDefault();
        navigate("/add");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);
  
  const { 
    cocktails,
    randomSuggestions,
    isLoading,
    isLoadingRandomSuggestions,
    error, 
    deleteCustomCocktail,
    isDeletingCocktail
  } = useCocktails(debouncedQuery);

  const [displayedCocktails, setDisplayedCocktails] = useState<CustomCocktail[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const prevCocktailsRef = useRef<string>("");
  
  const lastCocktailElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && displayedCocktails.length < cocktails.length) {
        setIsLoadingMore(true);
        if (window.innerHeight + window.scrollY > document.documentElement.scrollHeight * 0.85) {
          setTimeout(() => {
            const nextItems = cocktails.slice(
              displayedCocktails.length,
              displayedCocktails.length + 5
            );
            if (nextItems.length > 0) {
              setDisplayedCocktails(prev => [...prev, ...nextItems]);
            }
            setIsLoadingMore(false);
          }, 500);
        }
      }
    }, {
      threshold: 0.5
    });
    if (node) observer.current.observe(node);
  }, [cocktails, displayedCocktails.length, isLoading]);

  useEffect(() => {
    const currentCocktails = JSON.stringify(cocktails);
    if (prevCocktailsRef.current !== currentCocktails) {
      setDisplayedCocktails(cocktails.slice(0, 5));
      setIsLoadingMore(false);
      prevCocktailsRef.current = currentCocktails;
    }
  }, [cocktails]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

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
      <div className="relative max-w-xl mx-auto z-10">
        <div className="relative">
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-base-content/50" />
          <input
            ref={searchInputRef}
            type="search"
            placeholder="Search cocktails... (Press '/' to focus)"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault();
                setSearchQuery("");
                e.currentTarget.blur();
              }
            }}
            className="input input-bordered w-full pl-10 pr-16 shadow-sm hover:shadow-md focus:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 [&::-webkit-search-cancel-button]:cursor-pointer"
          />
          <kbd className="absolute right-3 top-3 px-2 py-1 text-xs font-mono bg-base-200 rounded opacity-50">/</kbd>
        </div>
      </div>

      <div className="relative z-0">
        {isLoading ? (
          <div className="py-6">
            <CocktailCardSkeletonGrid />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedCocktails.map((cocktail, index) => (
              <div key={cocktail.id} className="relative group">
                <div 
                  ref={index === displayedCocktails.length - 1 ? lastCocktailElementRef : undefined}
                  className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  onClick={(e) => {
                    if (!(e.target as HTMLElement).closest('.collapse') && 
                        !(e.target as HTMLElement).closest('.delete-btn')) {
                      navigate(`/recipe/${cocktail.id}`);
                    }
                  }}
                >
                  {cocktail.imageUrl && (
                    <figure className="relative">
                      <img
                        src={cocktail.imageUrl}
                        alt={cocktail.name}
                        loading="lazy"
                        className="aspect-[4/3] object-cover w-full transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-0 right-0 flex gap-2 m-2">
                        <div 
                          className="tooltip tooltip-left" 
                          data-tip={`${cocktail.ingredients.length} ingredients`}
                        >
                          <div className="badge badge-primary">
                            {cocktail.ingredients.length}
                          </div>
                        </div>
                      </div>
                    </figure>
                  )}
                  <div className="card-body p-0">
                    <div className="p-6 pb-2">
                      <h2 className="card-title">{cocktail.name}</h2>
                    </div>
                    <div 
                      className="collapse collapse-arrow hover:bg-base-100/50 transition-colors duration-200 rounded-lg px-6"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input type="checkbox" /> 
                      <div className="collapse-title text-sm">
                        View ingredients
                      </div>
                      <div className="collapse-content">
                        <ul className="space-y-1">
                          {cocktail.ingredients.map((ingredient, index) => (
                            <li key={index} className="text-sm">
                              • {ingredient.name} {ingredient.amount && `- ${ingredient.amount} ${ingredient.unitOfMeasure}`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                {cocktail.isCustom && (
                  <button
                    className="delete-btn btn btn-error btn-sm gap-2 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={() => setCocktailToDelete(cocktail.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        
        {isLoadingMore && displayedCocktails.length < cocktails.length && (
          <div className="mt-6">
            <CocktailCardSkeletonGrid />
            <div className="flex justify-center mt-8">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          </div>
        )}

        {!isLoading && cocktails.length === 0 && (
          <>
            {searchQuery ? (
              <EmptyState
                icon={<SearchX className="h-12 w-12 text-base-content/20" />}
                title="No Results Found"
                message="Try adjusting your search term or add your own custom cocktail."
              />
            ) : (
              <>
                <EmptyState
                  title="No Cocktails Yet"
                  message="Get started by searching for cocktails or adding your own custom recipe."
                />
                {!searchQuery && cocktails.length === 0 && (
                  <div className="mt-12">
                    <h2 className="text-xl font-semibold mb-6 text-center text-base-content/70">
                      Here are some cocktails you might like
                    </h2>
                    {isLoadingRandomSuggestions ? (
                      <CocktailCardSkeletonGrid />
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {randomSuggestions.map((cocktail) => (
                          <div key={cocktail.id} className="relative group">
                            <div 
                              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                              onClick={() => navigate(`/recipe/${cocktail.id}`)}
                            >
                              {cocktail.imageUrl && (
                                <figure className="relative">
                                  <img
                                    src={cocktail.imageUrl}
                                    alt={cocktail.name}
                                    loading="lazy"
                                    className="aspect-[4/3] object-cover w-full transition-transform duration-300 group-hover:scale-105"
                                  />
                                  <div className="absolute top-0 right-0 flex gap-2 m-2">
                                    <div 
                                      className="tooltip tooltip-left" 
                                      data-tip={`${cocktail.ingredients.length} ingredients`}
                                    >
                                      <div className="badge badge-primary">
                                        {cocktail.ingredients.length}
                                      </div>
                                    </div>
                                  </div>
                                </figure>
                              )}
                              <div className="card-body">
                                <h2 className="card-title">{cocktail.name}</h2>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

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

      <KeyboardShortcuts />
      <ScrollToTop />
    </div>
  );
}
