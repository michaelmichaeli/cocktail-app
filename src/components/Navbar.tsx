import { Link, useLocation } from "react-router-dom";
import { Wine, PlusCircle } from "lucide-react";

export function Navbar() {
  const location = useLocation();
  const isAddPage = location.pathname === "/add";

  return (
    <div className="navbar bg-base-100 border-b shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className="flex items-center space-x-2 transition-transform duration-200 hover:scale-105 group"
          >
            <Wine className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg text-primary">
              Cocktail App
            </span>
          </Link>
        </div>
        
        {!isAddPage && (
          <Link 
            to="/add"
            className="btn btn-primary gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Add Cocktail
          </Link>
        )}
      </div>
    </div>
  );
}
