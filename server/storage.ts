import { type Player, type InsertPlayerInput, type GameMode, type TierLevel, players, tierPoints } from "@shared/schema";
import { db } from "./db";
import { eq, ilike, desc } from "drizzle-orm";

export interface IStorage {
  getAllPlayers(): Promise<Player[]>;
  getPlayersByGameMode(gameMode: GameMode): Promise<Player[]>;
  getPlayerById(id: string): Promise<Player | undefined>;
  searchPlayers(query: string): Promise<Player[]>;
  createPlayer(player: InsertPlayerInput): Promise<Player>;
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
    const result = await db.insert(players).values(insertPlayer).returning();
    return result[0];
  }

  async getPlayerCount(): Promise<number> {
    const result = await db.select().from(players);
    return result.length;
  }

  async seedInitialData(): Promise<void> {
    const count = await this.getPlayerCount();
    console.log(`Database has ${count} players`);
  }
}

export const storage = new DatabaseStorage();
