import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Player, GameMode, getMinecraftAvatarUrl } from "@shared/types";
import { Header } from "@/components/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TierBadge } from "@/components/tier-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, Trophy, Target, Award } from "lucide-react";
import { SiDiscord } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { gameModeInfo } from "@/lib/game-modes";
import { Separator } from "@/components/ui/separator";

export default function PlayerProfile() {
  const [, params] = useRoute("/player/:id");
  const playerId = params?.id;

  const { data: player, isLoading, error } = useQuery<Player>({
    queryKey: [`/api/players/${playerId}`],
    enabled: !!playerId,
  });

  const getCombatTitleIcon = (title: string) => {
    const titleLevel = title.toLowerCase();
    if (titleLevel.includes("grandmaster")) return Trophy;
    if (titleLevel.includes("master")) return Trophy;
    if (titleLevel.includes("ace")) return Target;
    if (titleLevel.includes("expert")) return Trophy;
    return Trophy;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-48 w-full rounded-lg" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-5xl">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Player not found or failed to load profile.
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

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
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6 gap-2" data-testid="button-back">
            <ArrowLeft className="h-4 w-4" />
            Back to Rankings
          </Button>
        </Link>

        <Card className="mb-8 border-2 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              <Avatar className="h-32 w-32 shadow-xl border-4 border-background" data-testid={`profile-avatar-${player.discordId}`}>
                <AvatarImage 
                  src={getMinecraftAvatarUrl(player.username, 128)} 
                  alt={player.username} 
                />
                <AvatarFallback className="text-4xl font-bold bg-primary/20 text-primary">
                  {player.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-4xl font-black font-['Rajdhani'] mb-2" data-testid={`profile-name-${player.discordId}`}>
                      {player.username}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="secondary" className="text-sm font-semibold uppercase tracking-wide px-3 py-1 gap-1.5" data-testid={`profile-title-${player.discordId}`}>
                        {(() => {
                          const Icon = getCombatTitleIcon(player.combatTitle);
                          return <Icon className="h-4 w-4" />;
                        })()}
                        {player.combatTitle}
                      </Badge>
                      <Badge variant="outline" className="text-sm px-3 py-1" data-testid={`profile-region-${player.discordId}`}>
                        <span className="font-semibold">{player.region}</span>
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="h-5 w-5 text-primary" />
                  <span className="text-3xl font-black font-['Rajdhani'] text-foreground" data-testid={`profile-points-${player.discordId}`}>
                    {player.totalPoints}
                  </span>
                  <span className="text-muted-foreground">Total Points</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Target className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold font-['Rajdhani']">Game Mode Tiers</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tierEntries.map(([mode, tier]) => {
                const modeInfo = gameModeInfo[mode as GameMode];
                return (
                  <Card key={mode} className="hover-elevate transition-all" data-testid={`tier-card-${mode}`}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold flex items-center justify-between">
                        <span>{modeInfo.name}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <TierBadge 
                        gameMode={mode as GameMode} 
                        tier={tier} 
                        size="lg"
                      />
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {tierEntries.length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No tier rankings yet</p>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Combat Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Current Title</div>
                  <Badge variant="secondary" className="font-semibold">
                    {player.combatTitle}
                  </Badge>
                </div>
                <Separator />
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Total Points</div>
                  <div className="text-2xl font-black font-['Rajdhani']">{player.totalPoints}</div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Active Tiers</div>
                  <div className="text-2xl font-black font-['Rajdhani']">{tierEntries.length}</div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Highest Tier</div>
                  {tierEntries.length > 0 && (
                    <TierBadge 
                      gameMode={tierEntries[0][0] as GameMode} 
                      tier={tierEntries[0][1]} 
                      size="md"
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <SiDiscord className="h-5 w-5 text-[#5865F2]" />
                  Community
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Join Discord</div>
                  <a 
                    href="https://discord.gg/Rm49gjeYr9" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#5865F2] text-white text-sm font-semibold hover-elevate active-elevate-2 transition-all"
                    data-testid="discord-join-link"
                  >
                    <SiDiscord className="h-4 w-4" />
                    Discord Server
                  </a>
                </div>
                <Separator />
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Region</div>
                  <Badge variant="outline">{player.region}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
