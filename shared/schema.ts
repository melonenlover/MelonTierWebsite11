import { pgTable, text, varchar, integer, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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

export const playerRanks = pgTable("player_ranks", {
  id: serial("id").primaryKey(),
  discordId: varchar("discord_id", { length: 50 }).notNull(),
  minecraftName: varchar("minecraft_name", { length: 50 }).notNull(),
  minecraftUuid: varchar("minecraft_uuid", { length: 50 }),
  gamemode: varchar("gamemode", { length: 20 }).notNull(),
  rankName: varchar("rank_name", { length: 10 }).notNull(),
  rankPoints: integer("rank_points").notNull(),
  region: varchar("region", { length: 10 }),
  testerId: varchar("tester_id", { length: 50 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

export type PlayerRank = typeof playerRanks.$inferSelect;
export type InsertPlayerRank = typeof playerRanks.$inferInsert;

export const insertPlayerRankSchema = createInsertSchema(playerRanks, {
  discordId: z.string().min(1),
  minecraftName: z.string().min(1).max(50),
  minecraftUuid: z.string().optional(),
  gamemode: z.string().min(1),
  rankName: z.enum(tierLevels),
  rankPoints: z.number().int().min(0),
  region: z.enum(regions).optional(),
  testerId: z.string().optional()
}).omit({ id: true, createdAt: true, updatedAt: true });

export type InsertPlayerRankInput = z.infer<typeof insertPlayerRankSchema>;

export interface Player {
  discordId: string;
  username: string;
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
