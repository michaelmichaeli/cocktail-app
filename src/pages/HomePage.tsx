import { AlertCircle, ExternalLink } from "lucide-react";
import { useCocktails } from "../hooks/useCocktails";
import { CocktailCard } from "../components/CocktailCard";
import { CocktailCardSkeleton } from "../components/CocktailCardSkeleton";
import { EmptyState } from "../components/EmptyState";
import { SearchInput } from "../components/SearchInput";

export function HomePage() {
  const { 
    randomSuggestions,
    isLoadingRandomSuggestions,
    error 
  } = useCocktails("");

  return (
    <div className="container mx-auto p-6 space-y-8">
      <header className="relative max-w-xl mx-auto z-10 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-3">Welcome to Cocktail App</h1>
          <p className="text-base-content/80 mb-2">
            Discover and explore a vast collection of cocktail recipes powered by TheCocktailDB. 
            Search for your favorite drinks, get inspired by random suggestions and browse through 
            extensive collection.
          </p>
          <a 
            href="https://www.thecocktaildb.com/api.php" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm link link-primary inline-flex items-center gap-1 hover:gap-2 transition-all"
          >
            Browse API Documentation
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <SearchInput />
      </header>

      <main className="relative z-0">
        {error ? (
          <EmptyState
            icon={<AlertCircle className="h-12 w-12 text-error" />}
            title="Something went wrong"
            message="Failed to load cocktails. Please try again later."
          />
        ) : !isLoadingRandomSuggestions && randomSuggestions.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold mb-6">Random Cocktail Suggestions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {randomSuggestions.map((cocktail) => (
                <CocktailCard key={cocktail.id} cocktail={cocktail} />
              ))}
            </div>
          </div>
        ) : isLoadingRandomSuggestions && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <CocktailCardSkeleton key={index} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
