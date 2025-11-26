import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const gameModes = [
  "overall",
  "ltm",
  "vanilla",
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
  "HT1", "HT2", "HT3", "HT4",
  "LT1", "LT2", "LT3", "LT4"
] as const;

export type TierLevel = typeof tierLevels[number] | null;

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
  id: string;
  username: string;
  region: Region;
  totalPoints: number;
  combatTitle: CombatTitle;
  avatarUrl?: string;
  tiers: Record<GameMode, TierLevel>;
}

export const insertPlayerSchema = z.object({
  username: z.string().min(1).max(16),
  region: z.enum(regions),
  totalPoints: z.number().int().min(0),
  combatTitle: z.enum(combatTitles),
  avatarUrl: z.string().optional(),
  tiers: z.object({
    overall: z.enum(tierLevels).nullable(),
    ltm: z.enum(tierLevels).nullable(),
    vanilla: z.enum(tierLevels).nullable(),
    uhc: z.enum(tierLevels).nullable(),
    pot: z.enum(tierLevels).nullable(),
    nethop: z.enum(tierLevels).nullable(),
    smp: z.enum(tierLevels).nullable(),
    sword: z.enum(tierLevels).nullable(),
    axe: z.enum(tierLevels).nullable(),
    mace: z.enum(tierLevels).nullable()
  })
});

export type InsertPlayer = z.infer<typeof insertPlayerSchema>;

export interface GameModeInfo {
  id: GameMode;
  name: string;
  icon: string;
}
