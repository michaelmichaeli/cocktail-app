import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { CocktailGrid } from "../components/CocktailGrid";
import { CupSoda, FolderKanban, UtensilsCrossed } from "lucide-react";
import DEFAULT_COCKTAIL_IMAGE from "../assets/default-cocktail.png";
import type { Cocktail, CocktailWithIngredients } from "../types/cocktail";
import type { ReactNode } from "react";

type FilterType = 'ingredient' | 'glass' | 'category';

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
  const filterValue = searchParams.get(filterConfigs[type].param);
  const config = filterConfigs[type];

  useEffect(() => {
    document.title = `Cocktails - ${filterValue || 'Loading...'}`;
    return () => {
      document.title = "Cocktail App";
    };
  }, [filterValue]);

  const { data: cocktails = [], isLoading, error: queryError } = useQuery({
    queryKey: [type, filterValue],
    queryFn: async () => {
      if (!filterValue) return [];
      const apiCocktails = await config.fetch(filterValue);
      return apiCocktails.map(c => ({
        id: c.idDrink,
        name: c.strDrink,
        instructions: c.strInstructions || '',
        imageUrl: c.strDrinkThumb,
        ingredients: [],
        isAlcoholic: c.strAlcoholic?.toLowerCase().includes('alcoholic') ?? undefined,
        category: c.strCategory,
        glass: c.strGlass,
        tags: c.strTags?.split(',').map(tag => tag.trim()) || [],
        dateModified: c.dateModified || new Date().toISOString()
      })) as CocktailWithIngredients[];
    },
    enabled: !!filterValue,
  });

  const error = queryError instanceof Error ? queryError : queryError 
    ? new Error('Failed to load cocktails') 
    : null;

  if (!filterValue) {
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

  if (queryError) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="card overflow-hidden w-96 bg-error bg-opacity-10 text-error">
          <div className="card-body text-center">
            <h2 className="card-title justify-center">Error</h2>
            <p>Failed to load cocktails.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-start gap-4 mb-6">
        {type === "ingredient" ? (
          <img
            src={`https://www.thecocktaildb.com/images/ingredients/${encodeURIComponent(filterValue)}-Medium.png`}
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

      <CocktailGrid 
        cocktails={cocktails}
        isLoading={isLoading}
        error={error}
        emptyMessage={`No cocktails found for ${type} "${filterValue}"`}
        title=""
      />
    </div>
  );
}
