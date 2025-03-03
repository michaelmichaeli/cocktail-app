import { type ReactElement } from "react";
import { Wine, GlassWater, Beer } from "lucide-react";
import { AlcoholicType } from "../../types/features/cocktails";
import { AlcoholBadgeProps } from "../../types/components/ui";

export function AlcoholBadge({ type, size = "md" }: AlcoholBadgeProps) {
  const iconClass = size === "sm" ? "h-3 w-3" : "h-5 w-5";
  const badgeSize = size === "sm" ? "badge-sm" : "p-4 text-base font-medium";

  const validType = type || AlcoholicType.Optional;
  
  const config: Record<AlcoholicType, { icon: ReactElement; badgeClass: string }> = {
    [AlcoholicType.Alcoholic]: {
      icon: <Wine className={iconClass} />,
      badgeClass: 'badge-secondary'
    },
    [AlcoholicType.NonAlcoholic]: {
      icon: <GlassWater className={iconClass} />,
      badgeClass: 'badge-primary'
    },
    [AlcoholicType.Optional]: {
      icon: <Beer className={iconClass} />,
      badgeClass: 'badge-accent'
    }
  };

  const { icon, badgeClass } = config[validType];

  return (
    <span className={`badge ${badgeClass} ${badgeSize} gap-1`}>
      {icon}
      {validType}
    </span>
  );
}
