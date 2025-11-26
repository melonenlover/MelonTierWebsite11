import { GameMode } from "@shared/schema";
import { gameModeInfo, getGameModeIcon } from "@/lib/game-modes";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface GameModeNavProps {
  activeMode: GameMode;
  onModeChange: (mode: GameMode) => void;
}

export function GameModeNav({ activeMode, onModeChange }: GameModeNavProps) {
  const modes = Object.values(gameModeInfo);

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-4">
        {modes.map((mode) => {
          const Icon = getGameModeIcon(mode.id);
          const isActive = mode.id === activeMode;
          
          return (
            <Button
              key={mode.id}
              variant={isActive ? "default" : "outline"}
              size="default"
              onClick={() => onModeChange(mode.id)}
              className={cn(
                "gap-2 min-w-fit transition-all",
                isActive && "shadow-md"
              )}
              data-testid={`gamemode-${mode.id}`}
            >
              <Icon className="h-4 w-4" />
              <span className="font-semibold">{mode.name}</span>
            </Button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
