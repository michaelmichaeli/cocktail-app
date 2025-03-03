import { type ReactNode } from "react";
import { FilteredCocktailsHeaderProps } from "../types/features/filters";
import DEFAULT_COCKTAIL_IMAGE from "../assets/default-cocktail.png";

export function FilteredCocktailsHeader({
  title,
  filterType,
  filterValue,
  icon,
}: FilteredCocktailsHeaderProps) {
  return (
    <div className="flex items-start gap-4 mb-6">
      {filterType === "ingredient" ? (
        <img
          src={`https://www.thecocktaildb.com/images/ingredients/${encodeURIComponent(filterValue || '')}-Medium.png`}
          alt={filterValue}
          className="w-36 h-36 object-cover rounded"
          onError={(e) => {
            e.currentTarget.src = DEFAULT_COCKTAIL_IMAGE;
          }}
        />
      ) : (
        icon
      )}
      <div>
        <h1 className="text-3xl font-bold">
          {title} <span className="text-white">{filterValue}</span>
        </h1>
        {filterType === "ingredient" && (
          <p className="text-2xl text-base-content/70 mt-1">
            Browse all cocktails containing {filterValue}
          </p>
        )}
      </div>
    </div>
  );
}
