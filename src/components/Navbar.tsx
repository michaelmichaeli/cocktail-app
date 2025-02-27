import { Link, useLocation } from "react-router-dom";
import { Wine, PlusCircle } from "lucide-react";
import { SearchInput } from "./SearchInput";

export function Navbar() {
  const location = useLocation();
  const isAddPage = location.pathname === "/add";
  const isHomePage = location.pathname === "/";

  return (
    <>
      <div className="navbar bg-base-100 border-b shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between gap-4 w-full">
            <Link
              to="/"
              className="flex items-center space-x-2 transition-transform duration-200 hover:scale-105 group shrink-0"
            >
              <Wine className="h-6 w-6 text-accent" />
              <span className="font-semibold text-lg text-accent">
                Cocktail App
              </span>
            </Link>

            {!isHomePage && (
              <div className="flex-1 max-w-[400px] w-full">
                <SearchInput variant="navbar" className="w-full" />
              </div>
            )}

            {!isAddPage && (
              <Link
                to="/add"
                className="btn btn-secondary gap-2 h-9 min-h-0 px-3 shrink-0 hidden md:flex"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Cocktail</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {!isAddPage && (
        <Link
          to="/add"
          className="fixed top-[calc(4rem+1rem)] right-6 btn btn-secondary btn-circle shadow-lg md:hidden z-50 hover:scale-105 transition-transform"
        >
          <PlusCircle className="h-5 w-5" />
          <span className="sr-only">Add Cocktail</span>
        </Link>
      )}
    </>
  );
}
