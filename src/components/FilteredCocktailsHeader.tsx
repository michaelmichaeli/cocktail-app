import type { FilteredCocktailsHeaderProps } from "../types";

export function FilteredCocktailsHeader({
  title,
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
