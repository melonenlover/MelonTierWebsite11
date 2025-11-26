import { Player, GameMode } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TierBadge } from "./tier-badge";
import { cn } from "@/lib/utils";
import { Trophy, Medal, Award } from "lucide-react";
import { Link } from "wouter";

interface PlayerRankCardProps {
  player: Player;
  rank: number;
  gameMode: GameMode;
}

export function PlayerRankCard({ player, rank, gameMode }: PlayerRankCardProps) {
  const isTopThree = rank <= 3;
  
  const getRankBadge = () => {
    if (rank === 1) {
      return (
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gold to-gold/70 border-2 border-gold shadow-lg" data-testid="rank-badge-1">
          <Trophy className="w-8 h-8 text-gold-foreground" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-silver to-silver/70 border-2 border-silver shadow-md" data-testid="rank-badge-2">
          <Medal className="w-7 h-7 text-silver-foreground" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-bronze to-bronze/70 border-2 border-bronze shadow-md" data-testid="rank-badge-3">
          <Award className="w-7 h-7 text-bronze-foreground" />
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center min-w-12 h-12" data-testid={`rank-number-${rank}`}>
        <span className="text-2xl font-bold font-['Rajdhani'] text-muted-foreground">{rank}.</span>
      </div>
    );
  };

  const getCombatTitleIcon = () => {
    const titleLevel = player.combatTitle.toLowerCase();
    if (titleLevel.includes("grandmaster")) return Trophy;
    if (titleLevel.includes("master")) return Award;
    if (titleLevel.includes("ace")) return Medal;
    if (titleLevel.includes("expert")) return Trophy;
    return Trophy;
  };

  const tierEntries = Object.entries(player.tiers)
    .filter(([_, tier]) => tier !== null)
    .sort((a, b) => {
      const tierA = a[1] as string;
      const tierB = b[1] as string;
      const scoreA = tierA.startsWith("HT") ? 100 - parseInt(tierA.slice(2)) : 50 - parseInt(tierA.slice(2));
      const scoreB = tierB.startsWith("HT") ? 100 - parseInt(tierB.slice(2)) : 50 - parseInt(tierB.slice(2));
      return scoreB - scoreA;
    });

  return (
    <Link href={`/player/${player.discordId}`}>
      <Card
        className={cn(
          "hover-elevate active-elevate-2 transition-all cursor-pointer",
          isTopThree ? "border-2 mb-6" : "mb-3",
          rank === 1 && "border-gold bg-gradient-to-br from-gold/5 to-transparent",
          rank === 2 && "border-silver bg-gradient-to-br from-silver/5 to-transparent",
          rank === 3 && "border-bronze bg-gradient-to-br from-bronze/5 to-transparent"
        )}
        data-testid={`player-card-${player.discordId}`}
      >
        <div className={cn("p-6", isTopThree && "p-8")}>
          <div className="flex gap-4 md:gap-6 items-start">
            {getRankBadge()}
            
            <Avatar className={cn(isTopThree ? "h-20 w-20" : "h-16 w-16")} data-testid={`avatar-${player.discordId}`}>
              <AvatarImage src={player.avatarUrl ?? undefined} alt={player.username} />
              <AvatarFallback className="text-lg font-semibold bg-primary/20 text-primary">
                {player.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                <div>
                  <h3 className={cn(
                    "font-bold tracking-tight",
                    isTopThree ? "text-2xl" : "text-xl"
                  )} data-testid={`player-name-${player.discordId}`}>
                    {player.username}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs font-medium uppercase tracking-wide gap-1.5" data-testid={`combat-title-${player.discordId}`}>
                      {(() => {
                        const Icon = getCombatTitleIcon();
                        return <Icon className="h-3 w-3" />;
                      })()}
                      {player.combatTitle}
                    </Badge>
                    <span className={cn(
                      "font-bold font-['Rajdhani']",
                      isTopThree ? "text-lg" : "text-base"
                    )} data-testid={`points-${player.discordId}`}>
                      {player.totalPoints} pts
                    </span>
                  </div>
                </div>
                
                <Badge variant="outline" className="text-xs w-fit" data-testid={`region-${player.discordId}`}>
                  {player.region}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-2">
                {tierEntries.map(([mode, tier]) => (
                  <TierBadge
                    key={mode}
                    gameMode={mode as GameMode}
                    tier={tier}
                    size={isTopThree ? "md" : "sm"}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
