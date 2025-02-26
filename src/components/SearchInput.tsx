import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

interface SearchInputProps {
  initialValue?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export function SearchInput({ initialValue = "", onSearch, className = "" }: SearchInputProps) {
  const navigate = useNavigate();
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get("search")?.toString().trim() || "";
    
    if (searchQuery) {
      if (onSearch) {
        onSearch(searchQuery);
      } else {
        navigate(`/search?s=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`relative flex items-center ${className}`}
    >
      <Search className="absolute left-3 top-3.5 h-5 w-5 text-base-content/50" />
      <input
        type="search"
        name="search"
        placeholder="Search cocktails..."
        defaultValue={initialValue}
        className="input input-bordered w-full pl-10 shadow-sm hover:shadow-md focus:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 [&::-webkit-search-cancel-button]:cursor-pointer"
      />
    </form>
  );
}
