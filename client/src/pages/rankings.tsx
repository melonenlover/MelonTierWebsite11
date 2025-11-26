import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Player, GameMode } from "@shared/schema";
import { Header } from "@/components/header";
import { GameModeNav } from "@/components/game-mode-nav";
import { PlayerRankCard } from "@/components/player-rank-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Rankings() {
  const [activeGameMode, setActiveGameMode] = useState<GameMode>("overall");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: players, isLoading, error } = useQuery<Player[]>({
    queryKey: [`/api/rankings/${activeGameMode}`],
    refetchInterval: 30000,
  });

  const { data: searchResults, isLoading: isSearching } = useQuery<Player[]>({
    queryKey: [`/api/players/search/${encodeURIComponent(searchQuery)}`],
    enabled: searchQuery.length > 0,
    refetchInterval: 30000,
  });

  const displayPlayers = searchQuery ? searchResults : players;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} isSearching={isSearching} />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {!searchQuery && (
          <div className="mb-8">
            <div className="mb-6">
              <h2 className="text-3xl font-black font-['Rajdhani'] mb-2" data-testid="page-title">
                Leaderboard
              </h2>
              <p className="text-muted-foreground">
                Top players ranked by combat performance across all game modes
              </p>
            </div>
            
            <GameModeNav 
              activeMode={activeGameMode} 
              onModeChange={setActiveGameMode}
            />
          </div>
        )}

        {searchQuery && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">
              Search Results for "{searchQuery}"
            </h2>
            {searchResults && searchResults.length === 0 && (
              <p className="text-muted-foreground">No players found</p>
            )}
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load rankings. Please try again later.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-0">
          {isLoading || isSearching ? (
            Array.from({ length: 10 }).map((_, i) => (
              <Card key={i} className="mb-3 p-6">
                <div className="flex gap-6 items-start">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <div className="flex gap-2">
                      <Skeleton className="h-7 w-20" />
                      <Skeleton className="h-7 w-20" />
                      <Skeleton className="h-7 w-20" />
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : displayPlayers && displayPlayers.length > 0 ? (
            displayPlayers.map((player, index) => (
              <PlayerRankCard
                key={player.id}
                player={player}
                rank={index + 1}
                gameMode={activeGameMode}
              />
            ))
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No rankings available</p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
