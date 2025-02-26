import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Trash2, SearchX, AlertCircle } from "lucide-react";
import { useCocktails } from "../hooks/useCocktails";
import { CocktailCardSkeleton } from "../components/CocktailCardSkeleton";
import { EmptyState } from "../components/EmptyState";
import { CustomCocktail } from "../types/cocktail";
import { DeleteDialog } from "../components/DeleteDialog";
import { showToast } from "../lib/toast";
import { ScrollToTop } from "../components/ScrollToTop";
import { SearchInput } from "../components/SearchInput";

interface CardState {
  [key: string]: boolean;
}

export function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [displayedCocktails, setDisplayedCocktails] = useState<CustomCocktail[]>([]);
  const [cocktailToDelete, setCocktailToDelete] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [expandedCards, setExpandedCards] = useState<CardState>({});
  
  const navigate = useNavigate();
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

  const toggleIngredients = useCallback((cocktailId: string, isExpanded: boolean) => {
    setExpandedCards(prev => ({ ...prev, [cocktailId]: isExpanded }));
  }, []);

  useEffect(() => {
    const currentCocktails = JSON.stringify(cocktails);
    if (prevCocktailsRef.current !== currentCocktails) {
      setDisplayedCocktails(cocktails.slice(0, 8));
      setIsLoadingMore(false);
      prevCocktailsRef.current = currentCocktails;
    }
  }, [cocktails]);

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

  const renderCocktailCard = (cocktail: CustomCocktail, index: number) => (
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
              alt={`${cocktail.name} cocktail`}
              loading="lazy"
              className="aspect-[4/3] object-cover w-full transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-0 right-0 flex gap-2 m-2">
              <div className="badge badge-primary">
                {cocktail.ingredients.length}
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
            onClick={(e) => {
              e.stopPropagation();
              const newState = !expandedCards[cocktail.id];
              toggleIngredients(cocktail.id, newState);
            }}
          >
            <input 
              type="checkbox" 
              checked={expandedCards[cocktail.id] || false}
              onChange={(e) => toggleIngredients(cocktail.id, e.target.checked)}
            /> 
            <div className="collapse-title text-sm">
              View ingredients
            </div>
            <div className="collapse-content">
              <ul className="space-y-1">
                {cocktail.ingredients.map((ingredient, i) => (
                  <li key={i} className="text-sm">
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
          className="delete-btn btn btn-error btn-sm gap-2 absolute top-2 right-2 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-300"
          onClick={() => {
            setCocktailToDelete(cocktail.id);
          }}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      )}
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
            Array.from({ length: 8 }).map((_, index) => (
              <CocktailCardSkeleton key={index} />
            ))
          : displayedCocktails.map((cocktail, index) => renderCocktailCard(cocktail, index))}
          
          {isLoadingMore && displayedCocktails.length < cocktails.length &&
            Array.from({ length: 5 }).map((_, index) => (
              <CocktailCardSkeleton key={`loading-more-${index}`} />
            ))
          }
        </div>

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
