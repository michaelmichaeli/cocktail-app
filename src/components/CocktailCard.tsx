import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import type { CustomCocktail } from "../types/cocktail";
import DEFAULT_COCKTAIL_IMAGE from "../../public/default-cocktail.png";

interface CocktailCardProps {
  cocktail: CustomCocktail;
  onDelete?: (id: string) => void;
  className?: string;
}

export function CocktailCard({ 
  cocktail, 
  onDelete,
  className = ""
}: CocktailCardProps) {

  const cardContent = (
      <div className={`card overflow-hidden bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${className}`}>
      {(
        <figure className="relative">
          <img
            src={cocktail.imageUrl || DEFAULT_COCKTAIL_IMAGE}
            alt={`${cocktail.name} cocktail`}
            loading="lazy"
            className="aspect-[4/3] object-cover w-full transition-transform duration-300 group-hover:scale-105"
          />
        </figure>
      )}
      <div className="card-body p-0">
        <div className="p-6 pb-2">
          <h3 className="card-title">{cocktail.name}</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className={`badge ${cocktail.isAlcoholic ? 'badge-secondary' : 'badge-primary'} badge-sm`}>
              {cocktail.isAlcoholic ? 'Alcoholic' : 'Non-Alcoholic'}
            </span>
            {cocktail.category && (
              <span className="badge badge-outline badge-sm">{cocktail.category}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative group">
      <Link to={`/recipe/${cocktail.id}`}>
        {cardContent}
      </Link>
      {cocktail.isCustom && onDelete && (
        <button
          className="delete-btn btn btn-error btn-sm gap-2 absolute top-2 right-2 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-300"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(cocktail.id);
          }}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      )}
    </div>
  );
}
