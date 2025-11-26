export const gameModes = [
  "overall",
  "ltm",
  "crystal",
  "uhc",
  "pot",
  "nethop",
  "smp",
  "sword",
  "axe",
  "mace"
] as const;

export type GameMode = typeof gameModes[number];

export const tierLevels = [
  "HT1", "LT1", "HT2", "LT2", "HT3", "LT3", "HT4", "LT4", "HT5", "LT5"
] as const;

export type TierLevel = typeof tierLevels[number] | null;

export const tierPoints: Record<string, number> = {
  "HT1": 60,
  "LT1": 45,
  "HT2": 30,
  "LT2": 20,
  "HT3": 10,
  "LT3": 6,
  "HT4": 4,
  "LT4": 3,
  "HT5": 2,
  "LT5": 1,
};

export const regions = ["NA", "EU", "AS", "SA", "OC"] as const;
export type Region = typeof regions[number];

export const combatTitles = [
  "Combat Grandmaster",
  "Combat Master", 
  "Combat Ace",
  "Combat Expert",
  "Combat Specialist"
] as const;

export type CombatTitle = typeof combatTitles[number];

export interface Player {
  discordId: string;
  username: string;
  minecraftUuid: string | null;
  region: string | null;
  totalPoints: number;
  combatTitle: CombatTitle;
  avatarUrl: string | null;
  tiers: Record<GameMode, TierLevel>;
}

export interface GameModeInfo {
  id: GameMode;
  name: string;
  icon: string;
}

export function getMinecraftAvatarUrl(username: string, size: number = 64): string {
  return `https://mc-heads.net/avatar/${username}/${size}`;
}

export function getMinecraftHeadUrl(username: string, size: number = 64): string {
  return `https://mc-heads.net/head/${username}/${size}`;
}
