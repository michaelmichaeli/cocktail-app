import { useState, useEffect, useCallback, useMemo } from "react"
import { Filter, Loader2, XCircle } from "lucide-react"
import { useFiltersStore } from "../store/useFiltersStore"

interface FilterBarProps {
  initialFilters?: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  isAlcoholic?: boolean | null;
  category?: string;
  glass?: string;
  tags?: string[];
}

const defaultFilters: FilterOptions = {
  isAlcoholic: null,
  category: undefined,
  glass: undefined,
  tags: []
};

export function FilterBar({ initialFilters, onFilterChange }: FilterBarProps) {
  const shouldOpen = useMemo(() => {
    return initialFilters ? (
      initialFilters.isAlcoholic !== null ||
      initialFilters.category !== undefined ||
      initialFilters.glass !== undefined ||
      (initialFilters.tags?.length || 0) > 0
    ) : false;
  }, [initialFilters]);

  const [isOpen, setIsOpen] = useState(shouldOpen);

  const handleToggleOpen = useCallback(() => {
    setIsOpen((current: boolean) => !current);
  }, []);

  const filters = initialFilters || defaultFilters;
  
  const {
    categories,
    glasses,
    ingredients,
    alcoholicTypes,
    isLoading,
    error,
    fetchFilters
  } = useFiltersStore()

  useEffect(() => {
    fetchFilters()
  }, [fetchFilters]);

  useEffect(() => {
    const hasFilters = 
      filters.isAlcoholic !== null ||
      filters.category !== undefined ||
      filters.glass !== undefined ||
      (filters.tags?.length || 0) > 0;

    setIsOpen(hasFilters);
  }, [filters]);

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
    filters.isAlcoholic !== null ||
    filters.category !== undefined ||
    filters.glass !== undefined ||
    (filters.tags?.length || 0) > 0
  , [filters]);

  return (
    <div className="mb-6">
      <button
        className={`
          btn gap-2 transition-all duration-200
          ${isOpen ? 'btn-primary shadow-lg text-primary-content' : 'btn-ghost hover:shadow-md'} 
          ${hasActiveFilters ? 'border-primary hover:border-primary' : ''}
        `}
        onClick={handleToggleOpen}
      >
        <Filter className="h-4 w-4" />
        Filters
        {hasActiveFilters && (
          <div className="badge badge-primary badge-sm">Active</div>
        )}
      </button>

      {isOpen && (
        <div className="mt-4 p-4 bg-base-200 rounded-lg space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Filters</h3>
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
                  value={filters.isAlcoholic === null ? "" : String(filters.isAlcoholic)}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleFilterChange(
                      "isAlcoholic",
                      value === "" ? null : value === "true"
                    );
                  }}
                >
                  <option value="">All</option>
                  {alcoholicTypes.map((type) => (
                    <option 
                      key={type} 
                      value={type === 'Alcoholic' ? 'true' : 'false'}
                    >
                      {type}
                    </option>
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
      )}
    </div>
  );
}
