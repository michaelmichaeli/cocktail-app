import { FormEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { storage } from "../../lib/storage";

interface SearchInputProps {
  initialValue?: string;
  onSearch?: (query: string) => void;
  className?: string;
  variant?: 'default' | 'navbar';
}

export function SearchInput({ initialValue = "", onSearch, className = "", variant = 'default' }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(initialValue);
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get("search")?.toString().trim() || "";
    
    if (searchQuery) {
      if (onSearch) {
        onSearch(searchQuery);
      } else {
        navigate(`/search?search=${encodeURIComponent(searchQuery)}`);
        storage.clearCocktailFilters();
      }
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`flex items-center ${className}`}
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/50" />
        <input
          ref={inputRef}
          type="search"
          name="search"
          placeholder="Search cocktails..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={`input input-bordered w-full pl-9 pr-3 shadow-sm hover:shadow-md focus:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 ${
            variant === 'navbar' ? 'input-sm h-9' : ''
          }`}
        />
      </div>
      <button 
        type="submit"
        className={`btn btn-primary ml-2 ${variant === 'navbar' ? 'h-9 min-h-0 px-3' : ''}`}
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </button>
    </form>
  );
}
