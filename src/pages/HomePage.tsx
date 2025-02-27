import { ExternalLink, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { SearchInput } from "../components/SearchInput";
import { CocktailGrid } from "../components/CocktailGrid";
import { useHomePageCocktails } from "../hooks/useHomePageCocktails";

export function HomePage() {
  const {
    randomCocktails,
    nonAlcoholicCocktails,
    customCocktails,
    categoryCocktails,
    glassCocktails,
    ingredientCocktails,
    selectedCategory,
    selectedGlass,
    selectedIngredient,
    isLoading,
    error
  } = useHomePageCocktails();

  return (
    <div className="container mx-auto p-6 space-y-12">
      <header className="relative max-w-xl mx-auto z-10 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-3">Welcome to Cocktail App</h1>
          <p className="text-base-content/80 mb-2">
            Discover and explore a vast collection of cocktail recipes powered
            by TheCocktailDB. Search for your favorite drinks, get inspired by
            random suggestions and browse through extensive collection.
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

      <main className="relative max-w-4xl mx-auto z-0 space-y-16">
        {isLoading ? (
          <div className="space-y-16">
            <CocktailGrid
              title="Loading..."
              cocktails={[]}
              isLoading={true}
              error={null}
              emptyMessage=""
            />
            <CocktailGrid
              title="Loading..."
              cocktails={[]}
              isLoading={true}
              error={null}
              emptyMessage=""
            />
            <CocktailGrid
              title="Loading..."
              cocktails={[]}
              isLoading={true}
              error={null}
              emptyMessage=""
            />
          </div>
        ) : (
          <>
            <CocktailGrid
              title="My Custom Cocktails"
              cocktails={customCocktails}
              isLoading={false}
              error={null}
              emptyMessage="You haven't created any custom cocktails yet"
            />

            <CocktailGrid
              title="Non-Alcoholic Cocktails"
              cocktails={nonAlcoholicCocktails}
              isLoading={false}
              error={error}
              emptyMessage="No non-alcoholic cocktails found"
            />

            {selectedCategory && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{`Cocktails in ${selectedCategory} Category`}</h2>
              <Link 
                to={`/by-category?c=${encodeURIComponent(selectedCategory)}`}
                className="link link-primary inline-flex items-center gap-1 hover:gap-2 transition-all"
              >
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <CocktailGrid
              title=""
              cocktails={categoryCocktails}
              isLoading={isLoading}
              error={error}
              emptyMessage={`No cocktails found in ${selectedCategory}`}
            />
          </div>
        )}

        {selectedGlass && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{`Cocktails in ${selectedGlass}`}</h2>
              <Link 
                to={`/by-glass?g=${encodeURIComponent(selectedGlass)}`}
                className="link link-primary inline-flex items-center gap-1 hover:gap-2 transition-all"
              >
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <CocktailGrid
              title=""
              cocktails={glassCocktails}
              isLoading={isLoading}
              error={error}
              emptyMessage={`No cocktails found in ${selectedGlass}`}
            />
          </div>
        )}

        {selectedIngredient && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{`Cocktails with ${selectedIngredient}`}</h2>
              <Link 
                to={`/by-ingredient?i=${encodeURIComponent(selectedIngredient)}`}
                className="link link-primary inline-flex items-center gap-1 hover:gap-2 transition-all"
              >
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <CocktailGrid
              title=""
              cocktails={ingredientCocktails}
              isLoading={isLoading}
              error={error}
              emptyMessage={`No cocktails found with ${selectedIngredient}`}
            />
          </div>
        )}

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Random Cocktails</h2>
              <CocktailGrid
                title=""
                cocktails={randomCocktails}
                isLoading={false}
                error={error}
                emptyMessage="No random cocktails found"
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
