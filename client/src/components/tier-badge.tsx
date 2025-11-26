import { GameMode, TierLevel } from "@shared/schema";
import { getGameModeIcon } from "@/lib/game-modes";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TierBadgeProps {
  gameMode: GameMode;
  tier: TierLevel;
  size?: "sm" | "md" | "lg";
}

export function TierBadge({ gameMode, tier, size = "md" }: TierBadgeProps) {
  const Icon = getGameModeIcon(gameMode);
  
  if (!tier) {
    return null;
  }

  const getTierColor = (tierLevel: string) => {
    if (tierLevel === "HT1") return "bg-gradient-to-br from-gold to-gold/80 text-gold-foreground border-gold shadow-md";
    if (tierLevel.startsWith("HT")) return "bg-gradient-to-br from-primary/25 to-primary/15 text-primary border-primary/50";
    return "bg-muted text-muted-foreground border-border";
  };

  const sizeClasses = {
    sm: "h-7 gap-1 px-2",
    md: "h-8 gap-1.5 px-2.5",
    lg: "h-10 gap-2 px-3"
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4"
  };

  const textSizes = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm"
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-bold uppercase tracking-wide border transition-colors",
        getTierColor(tier),
        sizeClasses[size]
      )}
      data-testid={`tier-badge-${gameMode}`}
    >
      <Icon className={iconSizes[size]} />
      <span className={textSizes[size]}>{tier}</span>
    </Badge>
  );
}
