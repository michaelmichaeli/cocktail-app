import type { FilteredCocktailsHeaderProps } from "../types";
import { FilteredCocktailsHeaderProps as OldFilteredCocktailsHeaderProps } from "../types/features/filters";
import DEFAULT_COCKTAIL_IMAGE from "../assets/default-cocktail.png";

export function FilteredCocktailsHeader({
  title,
  filterType,
  filterValue,
  icon,
}: FilteredCocktailsHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {icon}
      <h1 className="text-2xl font-bold">
        {title} <span className="text-primary">{filterValue}</span>
      </h1>
    </div>
  );
}
