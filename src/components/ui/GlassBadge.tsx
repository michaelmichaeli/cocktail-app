import { GlassBadgeProps } from '../../types';
import { CupSoda } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export function GlassBadge({ glass, size = "md", noLink }: GlassBadgeProps) {
  const navigate = useNavigate();
  const iconClass = size === "sm" ? "h-3 w-3" : "h-5 w-5";
  const badgeSize = size === "sm" ? "badge-sm" : "p-4 text-base font-medium";
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/by-glass?g=${encodeURIComponent(glass)}`);
  };
  
  const badge = (
    <span
      role="button"
      onClick={noLink ? undefined : handleClick}
      className={`badge badge-info ${badgeSize} gap-1 hover:brightness-110 transition-all ${noLink ? '' : 'cursor-pointer'}`}
    >
      <CupSoda className={iconClass} />
      {glass}
    </span>
  );

  if (noLink) {
    return badge;
  }

  return (
    <Link
      to={`/by-glass?g=${encodeURIComponent(glass)}`}
      onClick={handleClick}
      className="no-underline"
    >
      {badge}
    </Link>
  );
}
