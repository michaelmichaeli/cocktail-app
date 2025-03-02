import { type ReactElement } from "react";
import { Wine, GlassWater, Beer } from "lucide-react";
import { AlcoholicType } from "../../types/features/cocktails";

interface AlcoholBadgeProps {
  type?: AlcoholicType;
  size?: "sm" | "md";
}

export function AlcoholBadge({ type, size = "sm" }: AlcoholBadgeProps) {
  const iconClass = size === "sm" ? "h-3 w-3" : "h-5 w-5";
  const badgeSize = size === "sm" ? "badge-sm" : "p-4 text-base font-medium";

  const validType = type || AlcoholicType.OPTIONAL;
  
  const config: Record<AlcoholicType, { icon: ReactElement; badgeClass: string }> = {
    [AlcoholicType.ALCOHOLIC]: {
      icon: <Wine className={iconClass} />,
      badgeClass: 'badge-secondary'
    },
    [AlcoholicType.NON_ALCOHOLIC]: {
      icon: <GlassWater className={iconClass} />,
      badgeClass: 'badge-primary'
    },
    [AlcoholicType.OPTIONAL]: {
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
