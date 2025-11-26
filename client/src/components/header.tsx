import { Search, Loader2, Swords } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Player } from "@shared/schema";

interface HeaderProps {
  onSearch?: (query: string) => void;
  isSearching?: boolean;
}

export function Header({ onSearch, isSearching }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  const { data: searchResults } = useQuery<Player[]>({
    queryKey: [`/api/players/search/${encodeURIComponent(searchQuery.trim())}`],
    enabled: searchQuery.trim().length > 0
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch?.(searchQuery.trim());
      if (searchResults && searchResults.length > 0) {
        setLocation(`/player/${searchResults[0].id}`);
        setSearchQuery("");
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer hover-elevate active-elevate-2 px-3 py-2 rounded-md transition-all" data-testid="logo">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 shadow-md">
                <Swords className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-black font-['Rajdhani'] tracking-tight text-foreground">
                  MCTIERS
                </h1>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Rankings</p>
              </div>
            </div>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
                data-testid="input-search"
                disabled={isSearching}
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
              )}
            </div>
          </form>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 border" data-testid="server-info">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-muted-foreground">mcpvp.club</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
