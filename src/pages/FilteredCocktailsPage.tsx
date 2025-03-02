import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { CupSoda, FolderKanban, UtensilsCrossed } from "lucide-react";
import type { ReactNode } from "react";
import { useFilteredCocktails, FilterType } from "../hooks/useFilteredCocktails";
import { cocktailsApi } from "../api/cocktails";
import { CocktailGrid } from "../components/CocktailGrid";
import { ErrorState } from "../components/ErrorState";
import { FilteredCocktailsHeader } from "../components/FilteredCocktailsHeader";
import { FilteredCocktailsHeaderSkeleton } from "../components/FilteredCocktailsHeaderSkeleton";
import type { Cocktail } from "../types/features/cocktails";

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
    fetch: cocktailsApi.getCocktailsByIngredient
  },
  glass: {
    title: 'Cocktails served in',
    icon: <CupSoda className="h-6 w-6" />,
    param: 'g',
    fetch: cocktailsApi.getCocktailsByGlass
  },
  category: {
    title: 'Cocktails in category',
    icon: <FolderKanban className="h-6 w-6" />,
    param: 'c',
    fetch: cocktailsApi.getCocktailsByCategory
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

  if (!filterValue && !isLoading) {
    return (
      <ErrorState 
        title="Missing Filter"
        message={`No ${type} specified.`}
      />
    );
  }

  if (error && !isLoading) {
    return (
      <ErrorState 
        title="Error"
        message="Failed to load cocktails."
      />
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      {isLoading ? (
        <FilteredCocktailsHeaderSkeleton />
      ) : (
        <FilteredCocktailsHeader
          title={config.title}
          filterType={type}
          filterValue={filterValue}
          icon={config.icon}
        />
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
