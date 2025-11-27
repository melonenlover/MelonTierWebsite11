import type { Request, Response, NextFunction } from "express";
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const express = require("express");
const serverless = require("serverless-http");
const { Pool } = require("pg");
const { drizzle } = require("drizzle-orm/node-postgres");
const { eq, ilike, sql } = require("drizzle-orm");
const { pgTable, varchar, integer, serial, timestamp } = require("drizzle-orm/pg-core");

const gameModes = [
  "overall", "ltm", "crystal", "uhc", "pot", "nethop", "smp", "sword", "axe", "mace"
] as const;

type GameMode = typeof gameModes[number];
type TierLevel = "HT1" | "LT1" | "HT2" | "LT2" | "HT3" | "LT3" | "HT4" | "LT4" | "HT5" | "LT5" | null;
type CombatTitle = "Combat Grandmaster" | "Combat Master" | "Combat Ace" | "Combat Expert" | "Combat Specialist";

const tierPoints: Record<string, number> = {
  "HT1": 60, "LT1": 45, "HT2": 30, "LT2": 20, "HT3": 10, "LT3": 6, "HT4": 4, "LT4": 3, "HT5": 2, "LT5": 1,
};

interface Player {
  discordId: string;
  username: string;
  minecraftUuid: string | null;
  region: string | null;
  totalPoints: number;
  combatTitle: CombatTitle;
  avatarUrl: string | null;
  tiers: Record<GameMode, TierLevel>;
}

const playerRanks = pgTable("player_ranks", {
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

interface PlayerRank {
  id: number;
  discordId: string;
  minecraftName: string;
  minecraftUuid: string | null;
  gamemode: string;
  rankName: string;
  rankPoints: number;
  region: string | null;
  testerId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

let pool: any = null;

function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  if (!pool) {
    pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
  }
  return drizzle(pool);
}

function getCombatTitle(totalPoints: number): CombatTitle {
  if (totalPoints >= 200) return "Combat Grandmaster";
  if (totalPoints >= 100) return "Combat Master";
  if (totalPoints >= 50) return "Combat Ace";
  if (totalPoints >= 20) return "Combat Expert";
  return "Combat Specialist";
}

function aggregatePlayerData(ranks: PlayerRank[]): Player[] {
  const playerMap = new Map<string, Player>();

  for (const rank of ranks) {
    let player = playerMap.get(rank.discordId);
    
    if (!player) {
      const emptyTiers: Record<GameMode, TierLevel> = {
        overall: null, ltm: null, crystal: null, uhc: null, pot: null,
        nethop: null, smp: null, sword: null, axe: null, mace: null
      };
      
      player = {
        discordId: rank.discordId,
        username: rank.minecraftName,
        minecraftUuid: rank.minecraftUuid,
        region: rank.region,
        totalPoints: 0,
        combatTitle: "Combat Specialist",
        avatarUrl: null,
        tiers: emptyTiers
      };
      playerMap.set(rank.discordId, player);
    }

    const gamemode = rank.gamemode.toLowerCase() as GameMode;
    if (gameModes.includes(gamemode) && gamemode !== "overall") {
      player.tiers[gamemode] = rank.rankName as TierLevel;
      player.totalPoints += rank.rankPoints;
    }
  }

  const players = Array.from(playerMap.values());
  for (const player of players) {
    player.combatTitle = getCombatTitle(player.totalPoints);
  }

  return players;
}

async function getAllPlayers(): Promise<Player[]> {
  const db = getDb();
  const ranks = await db.select().from(playerRanks);
  const players = aggregatePlayerData(ranks);
  return players.sort((a: Player, b: Player) => b.totalPoints - a.totalPoints);
}

async function getPlayersByGameMode(gameMode: GameMode): Promise<Player[]> {
  const db = getDb();
  if (gameMode === "overall") {
    return getAllPlayers();
  }

  const allRanks = await db.select().from(playerRanks);
  const allPlayers = aggregatePlayerData(allRanks);
  
  return allPlayers
    .filter((p: Player) => p.tiers[gameMode] !== null)
    .sort((a: Player, b: Player) => {
      const tierA = a.tiers[gameMode] as string;
      const tierB = b.tiers[gameMode] as string;
      const scoreA = tierPoints[tierA] || 0;
      const scoreB = tierPoints[tierB] || 0;
      return scoreB - scoreA;
    });
}

async function getPlayerById(id: string): Promise<Player | undefined> {
  const db = getDb();
  const ranks = await db.select().from(playerRanks).where(eq(playerRanks.discordId, id));
  
  if (ranks.length === 0) return undefined;
  
  const allRanks = await db.select().from(playerRanks);
  const allPlayers = aggregatePlayerData(allRanks);
  return allPlayers.find((p: Player) => p.discordId === id);
}

async function searchPlayers(query: string): Promise<Player[]> {
  const db = getDb();
  const matchingRanks = await db
    .select()
    .from(playerRanks)
    .where(ilike(playerRanks.minecraftName, `%${query}%`));
  
  if (matchingRanks.length === 0) return [];
  
  const discordIds = Array.from(new Set(matchingRanks.map((r: PlayerRank) => r.discordId)));
  const allRanks = await db.select().from(playerRanks);
  const allPlayers = aggregatePlayerData(allRanks);
  
  return allPlayers
    .filter((p: Player) => discordIds.includes(p.discordId))
    .sort((a: Player, b: Player) => b.totalPoints - a.totalPoints);
}

async function getPlayerCount(): Promise<number> {
  const db = getDb();
  const result = await db
    .select({ count: sql<number>`COUNT(DISTINCT ${playerRanks.discordId})` })
    .from(playerRanks);
  return Number(result[0]?.count ?? 0);
}

const app = express();
const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

router.get("/rankings/:gameMode", async (req: Request, res: Response) => {
  try {
    console.log("DATABASE_URL set:", !!process.env.DATABASE_URL);
    console.log("Fetching rankings for gameMode:", req.params.gameMode);
    
    const { gameMode } = req.params;
    
    const validGameModes = [...gameModes];
    if (!validGameModes.includes(gameMode as any)) {
      return res.status(400).json({ 
        error: "Invalid game mode",
        validModes: validGameModes 
      });
    }

    const players = await getPlayersByGameMode(gameMode as any);
    console.log("Players found:", players.length);
    res.json(players);
  } catch (error: any) {
    console.error("Error fetching rankings:", error.message, error.stack);
    res.status(500).json({ error: "Failed to fetch rankings", details: error.message });
  }
});

router.get("/rankings", async (_req: Request, res: Response) => {
  try {
    const players = await getAllPlayers();
    res.json(players);
  } catch (error) {
    console.error("Error fetching all players:", error);
    res.status(500).json({ error: "Failed to fetch players" });
  }
});

router.get("/players/search/:query", async (req: Request, res: Response) => {
  try {
    const { query } = req.params;
    
    if (!query || query.trim().length === 0) {
      return res.json([]);
    }

    const players = await searchPlayers(query);
    res.json(players);
  } catch (error) {
    console.error("Error searching players:", error);
    res.status(500).json({ error: "Failed to search players" });
  }
});

router.get("/players/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const player = await getPlayerById(id);
    
    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }

    res.json(player);
  } catch (error) {
    console.error("Error fetching player:", error);
    res.status(500).json({ error: "Failed to fetch player" });
  }
});

router.get("/gamemodes", async (_req: Request, res: Response) => {
  try {
    const gameModesList = gameModes.filter(mode => mode !== "overall").map(mode => ({
      id: mode,
      name: mode.charAt(0).toUpperCase() + mode.slice(1)
    }));
    res.json(gameModesList);
  } catch (error) {
    console.error("Error fetching game modes:", error);
    res.status(500).json({ error: "Failed to fetch game modes" });
  }
});

router.get("/stats/player-count", async (_req: Request, res: Response) => {
  try {
    const count = await getPlayerCount();
    res.json({ count });
  } catch (error) {
    console.error("Error fetching player count:", error);
    res.status(500).json({ error: "Failed to fetch player count" });
  }
});

app.use("/", router);
app.use("/.netlify/functions/api", router);

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

export const handler = serverless(app, {
  basePath: "/.netlify/functions/api"
});
