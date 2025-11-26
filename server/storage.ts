import { type Player, type InsertPlayerInput, type GameMode, type TierLevel, players, tierPoints, gameModes } from "@shared/schema";
import { db } from "./db";
import { eq, ilike, desc, count } from "drizzle-orm";

function calculateTotalPoints(tiers: Record<GameMode, TierLevel>): number {
  let total = 0;
  for (const mode of gameModes) {
    if (mode === "overall") continue;
    const tier = tiers[mode];
    if (tier) {
      total += tierPoints[tier] || 0;
    }
  }
  return total;
}

export interface IStorage {
  getAllPlayers(): Promise<Player[]>;
  getPlayersByGameMode(gameMode: GameMode): Promise<Player[]>;
  getPlayerById(id: string): Promise<Player | undefined>;
  searchPlayers(query: string): Promise<Player[]>;
  createPlayer(player: InsertPlayerInput): Promise<Player>;
  updatePlayer(id: string, updates: Partial<InsertPlayerInput>): Promise<Player | undefined>;
  getPlayerCount(): Promise<number>;
  seedInitialData(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getAllPlayers(): Promise<Player[]> {
    return await db.select().from(players).orderBy(desc(players.totalPoints));
  }

  async getPlayersByGameMode(gameMode: GameMode): Promise<Player[]> {
    const allPlayers = await db.select().from(players);
    
    if (gameMode === "overall") {
      return allPlayers.sort((a, b) => b.totalPoints - a.totalPoints);
    }

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
    const result = await db.select().from(players).where(eq(players.id, id));
    return result[0];
  }

  async searchPlayers(query: string): Promise<Player[]> {
    return await db
      .select()
      .from(players)
      .where(ilike(players.username, `%${query}%`))
      .orderBy(desc(players.totalPoints));
  }

  async createPlayer(insertPlayer: InsertPlayerInput): Promise<Player> {
    const totalPoints = calculateTotalPoints(insertPlayer.tiers);
    const result = await db.insert(players).values({
      ...insertPlayer,
      totalPoints
    }).returning();
    return result[0];
  }

  async updatePlayer(id: string, updates: Partial<InsertPlayerInput>): Promise<Player | undefined> {
    const existing = await this.getPlayerById(id);
    if (!existing) return undefined;

    const newTiers = updates.tiers || existing.tiers;
    const totalPoints = calculateTotalPoints(newTiers);

    const result = await db
      .update(players)
      .set({
        ...updates,
        totalPoints
      })
      .where(eq(players.id, id))
      .returning();
    
    return result[0];
  }

  async getPlayerCount(): Promise<number> {
    const result = await db.select({ count: count() }).from(players);
    return result[0]?.count ?? 0;
  }

  async seedInitialData(): Promise<void> {
    const count = await this.getPlayerCount();
    console.log(`Database has ${count} players`);
  }
}

export const storage = new DatabaseStorage();
