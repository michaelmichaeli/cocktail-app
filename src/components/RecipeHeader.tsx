import { Trash2, Wine, GlassWater, FolderKanban, CupSoda } from "lucide-react";
import { Link } from "react-router-dom";

interface RecipeHeaderProps {
  name: string;
  isCustom: boolean;
  isAlcoholic?: boolean;
  category: string;
  glass: string;
  onDelete?: () => void;
}

export function RecipeHeader({
  name,
  isCustom,
  isAlcoholic,
  category,
  glass,
  onDelete,
}: RecipeHeaderProps) {
  return (
    <header className="border-b pb-6 mb-8">
      <div className="flex justify-between items-start">
        <h1 className="text-4xl font-bold">{name}</h1>
        {isCustom && onDelete && (
          <button
            className="btn btn-error btn-sm gap-2"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        <span className={`badge ${isAlcoholic ? 'badge-secondary' : 'badge-primary'} gap-2 p-4 text-base font-medium`}>
          {isAlcoholic ? <Wine className="h-5 w-5" /> : <GlassWater className="h-5 w-5" />}
          {isAlcoholic ? 'Alcoholic' : 'Non-Alcoholic'}
        </span>
        <Link
          to={`/by-category?c=${encodeURIComponent(category || 'Unknown')}`}
          className="badge badge-accent gap-2 p-4 text-base font-medium hover:brightness-110 transition-all"
        >
          <FolderKanban className="h-5 w-5" />
          {category}
        </Link>
        <Link
          to={`/by-glass?g=${encodeURIComponent(glass || 'Unknown')}`}
          className="badge badge-info gap-2 p-4 text-base font-medium hover:brightness-110 transition-all"
        >
          <CupSoda className="h-5 w-5" />
          {glass}
        </Link>
      </div>
    </header>
  );
}
