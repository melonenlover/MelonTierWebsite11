import { GameMode, GameModeInfo } from "@shared/schema";
import { 
  Sword, 
  Axe,
  Flame, 
  Zap, 
  Shield, 
  Target, 
  Users, 
  Star,
  Trophy,
  Sparkles,
  Hammer
} from "lucide-react";

export const gameModeInfo: Record<GameMode, GameModeInfo> = {
  overall: {
    id: "overall",
    name: "Overall",
    icon: "Trophy"
  },
  ltm: {
    id: "ltm",
    name: "LTMs",
    icon: "Sparkles"
  },
  vanilla: {
    id: "vanilla",
    name: "Vanilla",
    icon: "Shield"
  },
  uhc: {
    id: "uhc",
    name: "UHC",
    icon: "Flame"
  },
  pot: {
    id: "pot",
    name: "Pot",
    icon: "Zap"
  },
  nethop: {
    id: "nethop",
    name: "NethOP",
    icon: "Target"
  },
  smp: {
    id: "smp",
    name: "SMP",
    icon: "Users"
  },
  sword: {
    id: "sword",
    name: "Sword",
    icon: "Sword"
  },
  axe: {
    id: "axe",
    name: "Axe",
    icon: "Axe"
  },
  mace: {
    id: "mace",
    name: "Mace",
    icon: "Hammer"
  }
};

export const getGameModeIcon = (gameMode: GameMode) => {
  const iconName = gameModeInfo[gameMode].icon;
  const iconMap: Record<string, any> = {
    Trophy,
    Sparkles,
    Shield,
    Flame,
    Zap,
    Target,
    Users,
    Sword,
    Axe,
    Hammer,
    Star
  };
  return iconMap[iconName] || Trophy;
};
