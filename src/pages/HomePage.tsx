import { ExternalLink } from "lucide-react";
import { SearchInput } from "../components/SearchInput";
import { CocktailGrid } from "../components/CocktailGrid";
import { useHomePageCocktails } from "../hooks/useHomePageCocktails";
import { useCustomCocktails } from "../hooks/useCustomCocktails";

export function HomePage() {
  const {
    randomCocktails,
    nonAlcoholicCocktails,
    isLoading: isLoadingHomePage,
    error
  } = useHomePageCocktails();

  const {
    cocktails: customCocktails,
    isLoading: isLoadingCustom
  } = useCustomCocktails();

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

      <main className="relative z-0 space-y-16">
        <CocktailGrid
          title="My Custom Cocktails"
          cocktails={customCocktails.slice(0, 4)}
          isLoading={isLoadingCustom}
          error={null}
          emptyMessage="You haven't created any custom cocktails yet"
        />

        <CocktailGrid
          title="Non-Alcoholic Cocktails"
          cocktails={nonAlcoholicCocktails.slice(0, 4)}
          isLoading={isLoadingHomePage}
          error={error}
          emptyMessage="No non-alcoholic cocktails found"
        />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Random Cocktails</h2>
          <CocktailGrid
            title=""
            cocktails={randomCocktails.slice(0, 4)}
            isLoading={isLoadingHomePage}
            error={error}
            emptyMessage="No random cocktails found"
          />
        </div>
      </main>
    </div>
  );
}
