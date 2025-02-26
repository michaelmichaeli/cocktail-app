import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { useCocktails } from "../hooks/useCocktails";
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
    <div className="container mx-auto p-6 space-y-6">
      <header className="relative max-w-xl mx-auto z-10">
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
                <Link 
                  key={cocktail.id}
                  to={`/recipe/${cocktail.id}`}
                  className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {cocktail.imageUrl && (
                    <figure className="relative">
                      <img
                        src={cocktail.imageUrl}
                        alt={`${cocktail.name} cocktail`}
                        loading="lazy"
                        className="aspect-[4/3] object-cover w-full transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-2 right-2">
                        <div className="badge badge-primary">
                          {cocktail.ingredients.length}
                        </div>
                      </div>
                    </figure>
                  )}
                  <div className="card-body">
                    <h3 className="card-title">{cocktail.name}</h3>
                  </div>
                </Link>
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
