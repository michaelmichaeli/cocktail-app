import { Trash2 } from "lucide-react";
import { AlcoholBadge } from "./ui/AlcoholBadge";
import { CategoryBadge } from "./ui/CategoryBadge";
import { GlassBadge } from "./ui/GlassBadge";
import type { AlcoholicType } from "../types/features/cocktails";

interface RecipeHeaderProps {
  name: string;
  isCustom: boolean;
  alcoholicType?: AlcoholicType | null;
  category?: string;
  glass?: string;
  onDelete?: () => void;
}

export function RecipeHeader({
  name,
  isCustom,
  alcoholicType,
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
        {alcoholicType && <AlcoholBadge type={alcoholicType} size="md" />}
        {category && <CategoryBadge category={category} size="md" />}
        {glass && <GlassBadge glass={glass} size="md" />}
      </div>
    </header>
  );
}
