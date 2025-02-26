import { useState } from "react";
import { Filter, XCircle } from "lucide-react";

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

  const handleTagInput = (value: string) => {
    const tagArray = value.split(",").map(tag => tag.trim()).filter(Boolean);
    handleFilterChange("tags", tagArray);
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
                <option value="true">Alcoholic</option>
                <option value="false">Non-Alcoholic</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Category</span>
              </label>
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
                <option value="Cocktail">Cocktail</option>
                <option value="Shot">Shot</option>
                <option value="Punch / Party Drink">Punch / Party Drink</option>
                <option value="Coffee / Tea">Coffee / Tea</option>
                <option value="Other/Unknown">Other/Unknown</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Glass Type</span>
              </label>
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
                <option value="Highball glass">Highball glass</option>
                <option value="Cocktail glass">Cocktail glass</option>
                <option value="Old-fashioned glass">Old-fashioned glass</option>
                <option value="Collins glass">Collins glass</option>
                <option value="Shot glass">Shot glass</option>
                <option value="Margarita glass">Margarita glass</option>
                <option value="Other/Unknown">Other/Unknown</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Tags</span>
              </label>
              <input
                type="text"
                placeholder="e.g., sweet, fruity, summer"
                className="input input-bordered w-full"
                value={filters.tags?.join(", ") || ""}
                onChange={(e) => handleTagInput(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
