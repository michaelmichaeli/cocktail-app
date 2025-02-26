import { useState, useEffect } from "react"
import { Filter, XCircle, Loader2 } from "lucide-react"
import { useFiltersStore } from "../store/useFiltersStore"

interface FilterBarProps {
  onFilterChange: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  isAlcoholic?: boolean | null;
  category?: string;
  glass?: string;
  tags?: string[];
}

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);
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
  }, [fetchFilters])

  const [filters, setFilters] = useState<FilterOptions>({
    isAlcoholic: null,
    category: undefined,
    glass: undefined,
    tags: []
  });

  const handleFilterChange = <T extends FilterOptions[keyof FilterOptions]>(
    key: keyof FilterOptions,
    value: T
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      isAlcoholic: null,
      category: undefined,
      glass: undefined,
      tags: []
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = 
    filters.isAlcoholic !== null ||
    filters.category !== undefined ||
    filters.glass !== undefined ||
    (filters.tags?.length || 0) > 0;

  return (
    <div className="mb-6">
      <button
        className={`btn btn-ghost gap-2 ${hasActiveFilters ? 'text-primary' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Filter className="h-4 w-4" />
        Filters
        {hasActiveFilters && (
          <div className="badge badge-primary badge-sm">Active</div>
        )}
      </button>

      {isOpen && (
        <div className="mt-4 p-4 bg-base-200 rounded-lg space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Filters</h3>
            {hasActiveFilters && (
              <button
                className="btn btn-ghost btn-sm gap-2 text-error"
                onClick={clearFilters}
              >
                <XCircle className="h-4 w-4" />
                Clear All
              </button>
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
                handleFilterChange<string | undefined>(
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
                handleFilterChange<string | undefined>(
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
                  handleFilterChange<string[]>(
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
