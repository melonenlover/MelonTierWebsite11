import { GameMode, GameModeInfo } from "@shared/schema";
import { 
  Sword, 
  Droplet, 
  Flame, 
  Zap, 
  Leaf, 
  Sun, 
  Cloud, 
  Star,
  Trophy
} from "lucide-react";

export const gameModeInfo: Record<GameMode, GameModeInfo> = {
  overall: {
    id: "overall",
    name: "Overall",
    icon: "Trophy"
  },
  melon: {
    id: "melon",
    name: "Melon",
    icon: "Droplet"
  },
  watermelon: {
    id: "watermelon",
    name: "Watermelon",
    icon: "Droplet"
  },
  cantaloupe: {
    id: "cantaloupe",
    name: "Cantaloupe",
    icon: "Sun"
  },
  honeydew: {
    id: "honeydew",
    name: "Honeydew",
    icon: "Leaf"
  },
  sweet: {
    id: "sweet",
    name: "Sweet",
    icon: "Star"
  },
  garden: {
    id: "garden",
    name: "Garden",
    icon: "Leaf"
  },
  summer: {
    id: "summer",
    name: "Summer",
    icon: "Sun"
  },
  tropical: {
    id: "tropical",
    name: "Tropical",
    icon: "Cloud"
  }
};

export const getGameModeIcon = (gameMode: GameMode) => {
  const iconName = gameModeInfo[gameMode].icon;
  const iconMap: Record<string, any> = {
    Trophy,
    Droplet,
    Flame,
    Zap,
    Leaf,
    Sun,
    Cloud,
    Star,
    Sword
  };
  return iconMap[iconName] || Trophy;
};
