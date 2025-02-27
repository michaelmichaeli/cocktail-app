import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { CocktailGrid } from "../components/CocktailGrid";
import { CupSoda, FolderKanban, UtensilsCrossed } from "lucide-react";
import DEFAULT_COCKTAIL_IMAGE from "../assets/default-cocktail.png";
import type { ReactNode } from "react";
import { useFilteredCocktails, FilterType } from "../hooks/useFilteredCocktails";
import { api } from "../lib/api";
import type { Cocktail } from "../types/cocktail";

interface FilterDetails {
  title: string;
  icon: ReactNode;
  param: string;
  fetch: (value: string) => Promise<Cocktail[]>;
}

const filterConfigs: Record<FilterType, FilterDetails> = {
  ingredient: {
    title: 'Cocktails with',
    icon: <UtensilsCrossed className="h-6 w-6" />,
    param: 'i',
    fetch: api.getCocktailsByIngredient
  },
  glass: {
    title: 'Cocktails served in',
    icon: <CupSoda className="h-6 w-6" />,
    param: 'g',
    fetch: api.getCocktailsByGlass
  },
  category: {
    title: 'Cocktails in category',
    icon: <FolderKanban className="h-6 w-6" />,
    param: 'c',
    fetch: api.getCocktailsByCategory
  }
};

export function FilteredCocktailsPage({ type }: { type: FilterType }) {
  const [searchParams] = useSearchParams();
  const filterValue = searchParams.get(filterConfigs[type].param) || '';
  const config = filterConfigs[type];

  useEffect(() => {
    document.title = `Cocktails - ${filterValue || 'Loading...'}`;
    return () => {
      document.title = "Cocktail App";
    };
  }, [filterValue]);

  const { cocktails, isLoading, error } = useFilteredCocktails(type, filterValue);

  const SkeletonHeader = () => (
    <div className="flex items-start gap-4 mb-6 animate-pulse">
      <div className="w-36 h-36 bg-base-300 rounded"></div>
      <div className="space-y-4 flex-1">
        <div className="h-8 bg-base-300 rounded w-3/4"></div>
        <div className="h-6 bg-base-300 rounded w-1/2"></div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto p-6 space-y-6">
        <SkeletonHeader />
        <CocktailGrid 
          cocktails={[]}
          isLoading={true}
          error={null}
          emptyMessage=""
          title=""
        />
      </div>
    );
  }

  if (!filterValue && !isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="card overflow-hidden w-96 bg-error bg-opacity-10 text-error">
          <div className="card-body text-center">
            <h2 className="card-title justify-center">Missing Filter</h2>
            <p>No {type} specified.</p>
          </div>
        </div>
      </div>
    );
  }

  return error && !isLoading ? (
    <div className="flex items-center justify-center h-[50vh]">
      <div className="card overflow-hidden w-96 bg-error bg-opacity-10 text-error">
        <div className="card-body text-center">
          <h2 className="card-title justify-center">Error</h2>
          <p>Failed to load cocktails.</p>
        </div>
      </div>
    </div>
  ) : (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      {isLoading ? (
        <SkeletonHeader />
      ) : (
        <div className="flex items-start gap-4 mb-6">
          {type === "ingredient" ? (
            <img
              src={`https://www.thecocktaildb.com/images/ingredients/${encodeURIComponent(filterValue || '')}-Medium.png`}
              alt={filterValue}
              className="w-36 h-36 object-cover rounded"
              onError={(e) => {
                e.currentTarget.src = DEFAULT_COCKTAIL_IMAGE;
              }}
            />
          ) : (
            config.icon
          )}
          <div>
            <h1 className="text-3xl font-bold">
              {config.title} <span className="text-white">{filterValue}</span>
            </h1>
            {type === "ingredient" && (
              <p className="text-2xl text-base-content/70 mt-1">
                Browse all cocktails containing {filterValue}
              </p>
            )}
          </div>
        </div>
      )}

      <CocktailGrid 
        cocktails={cocktails}
        isLoading={isLoading}
        error={error}
        emptyMessage={`No cocktails found for ${type} "${filterValue || ''}"`}
        title=""
      />
    </div>
  );
}
