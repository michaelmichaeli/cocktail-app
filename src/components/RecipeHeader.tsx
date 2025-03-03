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

export function RecipeHeader({ name, isCustom, alcoholicType, category, glass, onDelete }: RecipeHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-start gap-4">
        <h1 className="text-4xl font-bold break-words">{name}</h1>
        {isCustom && onDelete && (
          <button
            onClick={onDelete}
            className="btn btn-error btn-sm gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {alcoholicType && <AlcoholBadge type={alcoholicType} />}
        {category && <CategoryBadge category={category} />}
        {glass && <GlassBadge glass={glass} />}
      </div>
    </div>
  );
}
