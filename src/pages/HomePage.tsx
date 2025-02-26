import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, AlertCircle } from "lucide-react";
import { useCocktails } from "../hooks/useCocktails";
import { CocktailCardSkeleton } from "../components/CocktailCardSkeleton";
import { EmptyState } from "../components/EmptyState";
import { announce } from "../lib/dom";
import { LiveAnnouncer } from "../components/LiveAnnouncer";
import { SkipLink } from "../components/SkipLink";

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  const { 
    randomSuggestions,
    isLoadingRandomSuggestions,
    error 
  } = useCocktails("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?s=${encodeURIComponent(searchQuery.trim())}`);
      announce(`Searching for ${searchQuery}`, "polite");
    }
  };

  return (
    <>
      <SkipLink targetId="main-content" />
      <div className="container mx-auto p-6 space-y-6">
        <LiveAnnouncer />
        <header className="relative max-w-xl mx-auto z-10">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-base-content/50" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search cocktails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  e.preventDefault();
                  setSearchQuery("");
                  e.currentTarget.blur();
                }
              }}
              className="input input-bordered w-full pl-10 shadow-sm hover:shadow-md focus:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 [&::-webkit-search-cancel-button]:cursor-pointer"
              aria-label="Search cocktails"
            />
          </form>
        </header>

        <main id="main-content" className="relative z-0" tabIndex={-1}>
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
    </>
  );
}
