import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { CupSoda, FolderKanban, UtensilsCrossed } from "lucide-react";
import { useFilteredCocktails } from "../hooks/useFilteredCocktails";
import { cocktailsApi } from "../api/cocktails";
import { CocktailGrid } from "../components/CocktailGrid";
import { ErrorState } from "../components/ErrorState";
import { FilteredCocktailsHeader } from "../components/FilteredCocktailsHeader";
import { FilteredCocktailsHeaderSkeleton } from "../components/FilteredCocktailsHeaderSkeleton";
import type { FilterType, FilterConfig } from '../types/features/filters/index';
import type { CustomCocktail } from '../types/features/cocktails';

const filterConfigs: Record<FilterType, FilterConfig> = {
  ingredient: {
    title: 'Cocktails with',
    icon: <UtensilsCrossed className="h-6 w-6" />,
    param: 'i',
    fetch: cocktailsApi.getCocktailsByIngredient,
    matchCustom: (cocktail: CustomCocktail, value: string) => 
      cocktail.ingredients?.some(ing => 
        ing.name.toLowerCase().includes(value.toLowerCase())
      ) || false
  },
  glass: {
    title: 'Cocktails served in',
    icon: <CupSoda className="h-6 w-6" />,
    param: 'g',
    fetch: cocktailsApi.getCocktailsByGlass,
    matchCustom: (cocktail: CustomCocktail, value: string) => 
      (cocktail.glass?.toLowerCase() || '') === value.toLowerCase()
  },
  category: {
    title: 'Cocktails in category',
    icon: <FolderKanban className="h-6 w-6" />,
    param: 'c',
    fetch: cocktailsApi.getCocktailsByCategory,
    matchCustom: (cocktail: CustomCocktail, value: string) => 
      (cocktail.category?.toLowerCase() || '') === value.toLowerCase()
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
