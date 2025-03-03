import { CategoryBadgeProps } from '../../types';
import { FolderKanban } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export function CategoryBadge({ category, size = "md", noLink }: CategoryBadgeProps) {
  const navigate = useNavigate();
  const iconClass = size === "sm" ? "h-3 w-3" : "h-5 w-5";
  const badgeSize = size === "sm" ? "badge-sm" : "p-4 text-base font-medium";
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/by-category?c=${encodeURIComponent(category)}`);
  };
  
  const badge = (
    <span
      role="button"
      onClick={noLink ? undefined : handleClick}
      className={`badge badge-accent ${badgeSize} gap-1 hover:brightness-110 transition-all ${noLink ? '' : 'cursor-pointer'}`}
    >
      <FolderKanban className={iconClass} />
      {category}
    </span>
  );

  if (noLink) {
    return badge;
  }

  return (
    <Link
      to={`/by-category?c=${encodeURIComponent(category)}`}
      onClick={handleClick}
      className="no-underline"
    >
      {badge}
    </Link>
  );
}
