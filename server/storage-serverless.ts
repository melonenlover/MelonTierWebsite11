import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { type PlayerRank, playerRanks } from "../shared/schema";
import { type Player, type GameMode, type TierLevel, type CombatTitle, tierPoints, gameModes } from "../shared/types";
import { eq, ilike, desc, sql } from "drizzle-orm";

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
        overall: null,
        ltm: null,
        crystal: null,
        uhc: null,
        pot: null,
        nethop: null,
        smp: null,
        sword: null,
        axe: null,
        mace: null
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

  for (const player of playerMap.values()) {
    player.combatTitle = getCombatTitle(player.totalPoints);
  }

  return Array.from(playerMap.values());
}

function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  const queryClient = neon(process.env.DATABASE_URL);
  return drizzle(queryClient);
}

export interface IStorage {
  getAllPlayers(): Promise<Player[]>;
  getPlayersByGameMode(gameMode: GameMode): Promise<Player[]>;
  getPlayerById(id: string): Promise<Player | undefined>;
  searchPlayers(query: string): Promise<Player[]>;
  getPlayerCount(): Promise<number>;
  getRawRanks(): Promise<PlayerRank[]>;
}

export class ServerlessStorage implements IStorage {
  async getAllPlayers(): Promise<Player[]> {
    const db = getDb();
    const ranks = await db.select().from(playerRanks);
    const players = aggregatePlayerData(ranks);
    return players.sort((a, b) => b.totalPoints - a.totalPoints);
  }

  async getPlayersByGameMode(gameMode: GameMode): Promise<Player[]> {
    const db = getDb();
    if (gameMode === "overall") {
      return this.getAllPlayers();
    }

    const allRanks = await db.select().from(playerRanks);
    const allPlayers = aggregatePlayerData(allRanks);
    
    const playersWithTier = allPlayers
      .filter(p => p.tiers[gameMode] !== null)
      .sort((a, b) => {
        const tierA = a.tiers[gameMode] as string;
        const tierB = b.tiers[gameMode] as string;
        const scoreA = tierPoints[tierA] || 0;
        const scoreB = tierPoints[tierB] || 0;
        return scoreB - scoreA;
      });

    return playersWithTier;
  }

  async getPlayerById(id: string): Promise<Player | undefined> {
    const db = getDb();
    const ranks = await db
      .select()
      .from(playerRanks)
      .where(eq(playerRanks.discordId, id));
    
    if (ranks.length === 0) return undefined;
    
    const allRanks = await db.select().from(playerRanks);
    const allPlayers = aggregatePlayerData(allRanks);
    return allPlayers.find(p => p.discordId === id);
  }

  async searchPlayers(query: string): Promise<Player[]> {
    const db = getDb();
    const matchingRanks = await db
      .select()
      .from(playerRanks)
      .where(ilike(playerRanks.minecraftName, `%${query}%`));
    
    if (matchingRanks.length === 0) return [];
    
    const discordIds = [...new Set(matchingRanks.map(r => r.discordId))];
    
    const allRanks = await db.select().from(playerRanks);
    const allPlayers = aggregatePlayerData(allRanks);
    
    return allPlayers
      .filter(p => discordIds.includes(p.discordId))
      .sort((a, b) => b.totalPoints - a.totalPoints);
  }

  async getPlayerCount(): Promise<number> {
    const db = getDb();
    const result = await db
      .select({ count: sql<number>`COUNT(DISTINCT ${playerRanks.discordId})` })
      .from(playerRanks);
    return Number(result[0]?.count ?? 0);
  }

  async getRawRanks(): Promise<PlayerRank[]> {
    const db = getDb();
    return await db.select().from(playerRanks).orderBy(desc(playerRanks.rankPoints));
  }
}

export const storage = new ServerlessStorage();
