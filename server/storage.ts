import { type PlayerRank, playerRanks, type InsertPlayerRankInput } from "@shared/schema";
import { type Player, type GameMode, type TierLevel, type CombatTitle, tierPoints, gameModes, combatTitles } from "@shared/types";
import { db } from "./db";
import { eq, ilike, desc, count, sql, and } from "drizzle-orm";

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

export interface IStorage {
  getAllPlayers(): Promise<Player[]>;
  getPlayersByGameMode(gameMode: GameMode): Promise<Player[]>;
  getPlayerById(id: string): Promise<Player | undefined>;
  searchPlayers(query: string): Promise<Player[]>;
  getPlayerCount(): Promise<number>;
  getRawRanks(): Promise<PlayerRank[]>;
  upsertPlayerRank(data: InsertPlayerRankInput): Promise<PlayerRank>;
}

export class DatabaseStorage implements IStorage {
  async getAllPlayers(): Promise<Player[]> {
    const ranks = await db.select().from(playerRanks);
    const players = aggregatePlayerData(ranks);
    return players.sort((a, b) => b.totalPoints - a.totalPoints);
  }

  async getPlayersByGameMode(gameMode: GameMode): Promise<Player[]> {
    if (gameMode === "overall") {
      return this.getAllPlayers();
    }

    const ranks = await db
      .select()
      .from(playerRanks)
      .where(ilike(playerRanks.gamemode, gameMode));
    
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
    const ranks = await db
      .select()
      .from(playerRanks)
      .where(eq(playerRanks.discordId, id));
    
    if (ranks.length === 0) return undefined;
    
    const players = aggregatePlayerData(ranks);
    return players[0];
  }

  async searchPlayers(query: string): Promise<Player[]> {
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
    const result = await db
      .select({ count: sql<number>`COUNT(DISTINCT ${playerRanks.discordId})` })
      .from(playerRanks);
    return Number(result[0]?.count ?? 0);
  }

  async getRawRanks(): Promise<PlayerRank[]> {
    return await db.select().from(playerRanks).orderBy(desc(playerRanks.rankPoints));
  }

  async upsertPlayerRank(data: InsertPlayerRankInput): Promise<PlayerRank> {
    const existing = await db
      .select()
      .from(playerRanks)
      .where(
        and(
          eq(playerRanks.discordId, data.discordId),
          eq(playerRanks.gamemode, data.gamemode)
        )
      );

    if (existing.length > 0) {
      const [updated] = await db
        .update(playerRanks)
        .set({
          minecraftName: data.minecraftName,
          minecraftUuid: data.minecraftUuid,
          rankName: data.rankName,
          rankPoints: data.rankPoints,
          region: data.region,
          testerId: data.testerId,
          updatedAt: new Date()
        })
        .where(
          and(
            eq(playerRanks.discordId, data.discordId),
            eq(playerRanks.gamemode, data.gamemode)
          )
        )
        .returning();
      return updated;
    } else {
      const [inserted] = await db
        .insert(playerRanks)
        .values(data)
        .returning();
      return inserted;
    }
  }
}

export const storage = new DatabaseStorage();
