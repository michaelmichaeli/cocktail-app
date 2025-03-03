import { useCallback, useMemo } from "react";
import { Loader2, XCircle } from "lucide-react";
import { useFiltersStore } from "../store/filters";
import { AlcoholicType } from "../types/features/cocktails";
import type { FilterOptions } from "../types";

interface FilterBarProps {
  initialFilters?: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

const defaultFilters: FilterOptions = {
  alcoholicType: null,
  category: undefined,
  glass: undefined,
  tags: []
};

export function FilterBar({ initialFilters, onFilterChange }: FilterBarProps) {
  const filters = initialFilters || defaultFilters;
  
  const {
    categories,
    glasses,
    ingredients,
    isLoading,
    error
  } = useFiltersStore();

  const handleFilterChange = useCallback(<T extends FilterOptions[keyof FilterOptions]>(key: keyof FilterOptions, value: T) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  }, [filters, onFilterChange]);

  const handleClearFilters = useCallback(() => {
    onFilterChange(defaultFilters);
  }, [onFilterChange]);

  const hasActiveFilters = useMemo(() => 
    filters.alcoholicType !== null ||
    filters.category !== undefined ||
    filters.glass !== undefined ||
    (filters.tags?.length || 0) > 0
  , [filters]);

  return (
    <div className="bg-base-200 rounded-lg p-4 space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-lg">Filter Cocktails</h3>
        {hasActiveFilters && (
          <div 
            role="button"
            className="inline-flex items-center cursor-pointer hover:opacity-80 text-error focus:outline-none focus-visible:ring-2 focus-visible:ring-error rounded-md px-2 py-1"
            onClick={handleClearFilters}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClearFilters();
              }
            }}
          >
            <XCircle className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Clear All</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Alcohol Content</span>
          </label>
          {isLoading ? (
            <div className="flex items-center justify-center h-10">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-error text-sm">Failed to load alcohol types</div>
          ) : (
            <select
              className="select select-bordered w-full"
              value={filters.alcoholicType || ""}
              onChange={(e) => {
                const value = e.target.value;
                handleFilterChange(
                  "alcoholicType",
                  value === "" ? null : Object.values(AlcoholicType).find(t => t === value) || AlcoholicType.Optional
                );
              }}
            >
              <option value="">All</option>
              {Object.values(AlcoholicType).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Category</span>
          </label>
          {isLoading ? (
            <div className="flex items-center justify-center h-10">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-error text-sm">Failed to load categories</div>
          ) : (
            <select
              className="select select-bordered w-full"
              value={filters.category || ""}
              onChange={(e) =>
                handleFilterChange(
                  "category",
                  e.target.value || undefined
                )
              }
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Glass Type</span>
          </label>
          {isLoading ? (
            <div className="flex items-center justify-center h-10">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-error text-sm">Failed to load glass types</div>
          ) : (
            <select
              className="select select-bordered w-full"
              value={filters.glass || ""}
              onChange={(e) =>
                handleFilterChange(
                  "glass",
                  e.target.value || undefined
                )
              }
            >
              <option value="">All Glass Types</option>
              {glasses.map((glass) => (
                <option key={glass} value={glass}>
                  {glass}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Ingredients</span>
          </label>
          {isLoading ? (
            <div className="flex items-center justify-center h-10">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-error text-sm">Failed to load ingredients</div>
          ) : (
            <select
              className="select select-bordered w-full"
              value={filters.tags?.[0] || ""}
              onChange={(e) =>
                handleFilterChange(
                  "tags",
                  e.target.value ? [e.target.value] : []
                )
              }
            >
              <option value="">All Ingredients</option>
              {ingredients.map((ingredient) => (
                <option key={ingredient} value={ingredient}>
                  {ingredient}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  );
}
