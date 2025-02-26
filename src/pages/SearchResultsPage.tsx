import { useState, useEffect, useRef, useCallback, KeyboardEvent as ReactKeyboardEvent } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Trash2, SearchX, AlertCircle } from "lucide-react";
import { useCocktails } from "../hooks/useCocktails";
import { CocktailCardSkeleton } from "../components/CocktailCardSkeleton";
import { EmptyState } from "../components/EmptyState";
import { CustomCocktail } from "../types/cocktail";
import { DeleteDialog } from "../components/DeleteDialog";
import { showToast } from "../lib/toast";
import { ScrollToTop } from "../components/ScrollToTop";
import { getGridLayout } from "../lib/grid";
import { focusElement, getFocusableCard, announce } from "../lib/dom";
import { LiveAnnouncer } from "../components/LiveAnnouncer";
import { SkipLink } from "../components/SkipLink";

interface CardState {
  [key: string]: boolean;
}

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("s") || "";
  const [displayedCocktails, setDisplayedCocktails] = useState<CustomCocktail[]>([]);
  const [cocktailToDelete, setCocktailToDelete] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [mainGridFocusIndex, setMainGridFocusIndex] = useState(-1);
  const [gridLayout, setGridLayout] = useState(getGridLayout());
  const [expandedCards, setExpandedCards] = useState<CardState>({});
  
  const navigate = useNavigate();
  const mainGridRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const prevCocktailsRef = useRef<string>("");

  const { 
    cocktails,
    isLoading,
    error, 
    deleteCustomCocktail,
    isDeletingCocktail
  } = useCocktails(searchQuery);

  const toggleIngredients = useCallback((cocktailId: string, isExpanded: boolean) => {
    setExpandedCards(prev => ({ ...prev, [cocktailId]: isExpanded }));
    announce(
      isExpanded ? "Ingredients list expanded" : "Ingredients list collapsed",
      "polite"
    );
  }, []);

  useEffect(() => {
    if (isLoading) {
      announce("Loading cocktails...", "polite");
    } else if (displayedCocktails.length > 0) {
      announce(`${displayedCocktails.length} cocktails found for "${searchQuery}"`, "polite");
    } else if (searchQuery && cocktails.length === 0) {
      announce("No cocktails found matching your search.", "polite");
    }
  }, [isLoading, displayedCocktails.length, searchQuery, cocktails.length]);

  useEffect(() => {
    const handleResize = () => setGridLayout(getGridLayout());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCardKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>, index: number) => {
    const grid = mainGridRef.current;
    if (!grid) return;
    
    const currentRow = Math.floor(index / gridLayout.columns);
    const currentCol = index % gridLayout.columns;
    let newIndex: number | null = null;
    
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        if (currentCol < gridLayout.columns - 1 && index < displayedCocktails.length - 1) {
          newIndex = index + 1;
        }
        break;
      case "ArrowLeft":
        e.preventDefault();
        if (currentCol > 0) {
          newIndex = index - 1;
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        if (currentRow < Math.floor((displayedCocktails.length - 1) / gridLayout.columns)) {
          newIndex = index + gridLayout.columns;
          if (newIndex >= displayedCocktails.length) return;
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (currentRow > 0) {
          newIndex = index - gridLayout.columns;
          if (newIndex < 0) return;
        }
        break;
      case "Enter":
        e.preventDefault();
        if (e.target === e.currentTarget) {
          announce(`Opening ${displayedCocktails[index].name} recipe`, "assertive");
          navigate(`/recipe/${displayedCocktails[index].id}`);
        }
        break;
      case " ": // Space key
        e.preventDefault();
        toggleIngredients(displayedCocktails[index].id, !expandedCards[displayedCocktails[index].id]);
        break;
    }

    if (newIndex !== null && newIndex >= 0 && newIndex < displayedCocktails.length) {
      setMainGridFocusIndex(newIndex);
      focusElement(getFocusableCard(grid, newIndex));
      
      const cocktail = displayedCocktails[newIndex];
      announce(
        `${cocktail.name}: ${cocktail.ingredients.length} ingredients. ${
          newIndex + 1
        } of ${displayedCocktails.length}`,
        "polite"
      );
    }
  };

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
              announce(`Loaded ${nextItems.length} more cocktails`, "polite");
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
      setDisplayedCocktails(cocktails.slice(0, 8));
      setIsLoadingMore(false);
      prevCocktailsRef.current = currentCocktails;
    }
  }, [cocktails]);

  const renderCocktailCard = (cocktail: CustomCocktail, index: number) => (
    <div 
      key={cocktail.id} 
      className="relative group" 
      role="gridcell"
      aria-rowindex={gridLayout.getRowIndex(index)}
      aria-colindex={gridLayout.getColIndex(index)}
    >
      <div 
        ref={index === displayedCocktails.length - 1 ? lastCocktailElementRef : undefined}
        tabIndex={0}
        className={`
          card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform 
          hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 
          focus-visible:ring-offset-2 focus-visible:ring-offset-base-100 focus-visible:translate-y-0 
          focus-visible:scale-[1.02] ${index === mainGridFocusIndex ? 'ring-2 ring-primary/50 scale-[1.02]' : ''}
        `}
        onKeyDown={(e) => handleCardKeyDown(e, index)}
        onFocus={() => setMainGridFocusIndex(index)}
        onBlur={() => setMainGridFocusIndex(-1)}
        onClick={(e) => {
          if (!(e.target as HTMLElement).closest('.collapse') && 
              !(e.target as HTMLElement).closest('.delete-btn')) {
            navigate(`/recipe/${cocktail.id}`);
          }
        }}
        aria-label={`${cocktail.name} recipe card with ${cocktail.ingredients.length} ingredients`}
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
              <div 
                className="tooltip tooltip-left" 
                data-tip={`${cocktail.ingredients.length} ingredients`}
              >
                <div className="badge badge-primary" aria-label={`${cocktail.ingredients.length} ingredients`}>
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
              aria-label={`Toggle ${cocktail.name} ingredients list`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleIngredients(cocktail.id, !expandedCards[cocktail.id]);
                }
              }}
            /> 
            <div 
              className="collapse-title text-sm"
              role="button"
              tabIndex={0}
              aria-expanded={expandedCards[cocktail.id] || false}
              aria-controls={`ingredients-${cocktail.id}`}
            >
              View ingredients
            </div>
            <div 
              id={`ingredients-${cocktail.id}`}
              className="collapse-content"
              role="region"
              aria-label={`${cocktail.name} ingredients`}
            >
              <ul className="space-y-1" role="list">
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
            announce(`Delete ${cocktail.name} dialog opened`, "assertive");
          }}
          aria-label={`Delete ${cocktail.name} recipe`}
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
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
    <>
      <SkipLink targetId="main-content" />
      <div className="container mx-auto p-6 space-y-6">
        <LiveAnnouncer />
        <header className="relative max-w-xl mx-auto z-10">
          <Link 
            to="/"
            className="inline-flex items-center mb-4 text-base-content hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-2xl font-bold mb-4">
            Search Results for "{searchQuery}"
          </h1>
          {!isLoading && cocktails.length > 0 && (
            <p className="text-base-content/70">
              Found {cocktails.length} cocktail{cocktails.length === 1 ? '' : 's'}
            </p>
          )}
        </header>

        <main id="main-content" className="relative z-0" tabIndex={-1}>
          <div 
            ref={mainGridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            role="grid"
            aria-label="Cocktail recipes grid"
            aria-rowcount={gridLayout.getRowCount(displayedCocktails.length)}
            aria-colcount={gridLayout.columns}
          >
            {isLoading ? 
              Array.from({ length: 8 }).map((_, index) => (
                <div key={index} role="gridcell">
                  <CocktailCardSkeleton />
                </div>
              ))
            : displayedCocktails.map((cocktail, index) => renderCocktailCard(cocktail, index))}
            
            {isLoadingMore && displayedCocktails.length < cocktails.length &&
              Array.from({ length: 5 }).map((_, index) => (
                <div key={`loading-more-${index}`} role="gridcell">
                  <CocktailCardSkeleton />
                </div>
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
      </div>

      <DeleteDialog
        isOpen={!!cocktailToDelete}
        onClose={() => {
          setCocktailToDelete(null);
          announce("Delete dialog closed", "polite");
        }}
        onConfirm={async () => {
          if (cocktailToDelete && !isDeletingCocktail) {
            await deleteCustomCocktail(cocktailToDelete);
            showToast("Cocktail deleted successfully", "success");
            announce("Cocktail deleted successfully", "assertive");
            setCocktailToDelete(null);
          }
        }}
        title="Delete Cocktail"
        message="Are you sure you want to delete this cocktail? This action cannot be undone."
      />

      <ScrollToTop />
    </>
  );
}
