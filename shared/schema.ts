import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Game modes available in MelonTier
export const gameModes = [
  "overall",
  "melon",
  "watermelon",
  "cantaloupe",
  "honeydew",
  "sweet",
  "garden",
  "summer",
  "tropical"
] as const;

export type GameMode = typeof gameModes[number];

// Tier levels
export const tierLevels = [
  "HT1", "HT2", "HT3", "HT4",
  "LT1", "LT2", "LT3", "LT4"
] as const;

export type TierLevel = typeof tierLevels[number] | null;

// Region types
export const regions = ["NA", "EU", "AS", "SA", "OC"] as const;
export type Region = typeof regions[number];

// Combat titles
export const combatTitles = [
  "Combat Grandmaster",
  "Combat Master", 
  "Combat Ace",
  "Combat Expert",
  "Combat Specialist"
] as const;

export type CombatTitle = typeof combatTitles[number];

// Player interface
export interface Player {
  id: string;
  username: string;
  region: Region;
  totalPoints: number;
  combatTitle: CombatTitle;
  avatarUrl?: string;
  tiers: Record<GameMode, TierLevel>;
}

// Insert player schema
export const insertPlayerSchema = z.object({
  username: z.string().min(1).max(16),
  region: z.enum(regions),
  totalPoints: z.number().int().min(0),
  combatTitle: z.enum(combatTitles),
  avatarUrl: z.string().optional(),
  tiers: z.object({
    overall: z.enum(tierLevels).nullable(),
    melon: z.enum(tierLevels).nullable(),
    watermelon: z.enum(tierLevels).nullable(),
    cantaloupe: z.enum(tierLevels).nullable(),
    honeydew: z.enum(tierLevels).nullable(),
    sweet: z.enum(tierLevels).nullable(),
    garden: z.enum(tierLevels).nullable(),
    summer: z.enum(tierLevels).nullable(),
    tropical: z.enum(tierLevels).nullable()
  })
});

export type InsertPlayer = z.infer<typeof insertPlayerSchema>;

// Game mode info
export interface GameModeInfo {
  id: GameMode;
  name: string;
  icon: string;
}
