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
    if (count > 0) {
      console.log(`Database already has ${count} players, skipping seed`);
      return;
    }

    console.log("Seeding initial player data...");
    
    const mockPlayers: InsertPlayerInput[] = [
      {
        username: "Marlowww",
        region: "NA",
        totalPoints: 405,
        combatTitle: "Combat Grandmaster",
        tiers: {
          overall: "HT1",
          ltm: null,
          vanilla: "HT1",
          uhc: "LT1",
          pot: "LT1",
          nethop: "LT1",
          smp: "HT1",
          sword: "LT1",
          axe: "LT1",
          mace: "LT1"
        }
      },
      {
        username: "ItzRealMe",
        region: "NA",
        totalPoints: 330,
        combatTitle: "Combat Master",
        tiers: {
          overall: "HT1",
          ltm: null,
          vanilla: "HT1",
          uhc: "LT2",
          pot: "HT1",
          nethop: "HT1",
          smp: "HT1",
          sword: "HT2",
          axe: "LT2",
          mace: "LT2"
        }
      },
      {
        username: "Swight",
        region: "NA",
        totalPoints: 290,
        combatTitle: "Combat Master",
        tiers: {
          overall: "HT2",
          ltm: null,
          vanilla: "HT3",
          uhc: "HT1",
          pot: "LT2",
          nethop: "HT2",
          smp: "HT1",
          sword: "LT2",
          axe: "HT1",
          mace: "HT3"
        }
      },
      {
        username: "coldified",
        region: "EU",
        totalPoints: 256,
        combatTitle: "Combat Ace",
        tiers: {
          overall: "HT2",
          ltm: null,
          vanilla: "LT3",
          uhc: "HT2",
          pot: "HT2",
          nethop: "LT2",
          smp: "HT1",
          sword: "LT2",
          axe: "HT2",
          mace: "HT2"
        }
      },
      {
        username: "Kylaz",
        region: "NA",
        totalPoints: 222,
        combatTitle: "Combat Ace",
        tiers: {
          overall: "HT3",
          ltm: null,
          vanilla: "LT3",
          uhc: "LT3",
          pot: "HT1",
          nethop: "HT1",
          smp: "LT3",
          sword: "HT1",
          axe: "LT2",
          mace: null
        }
      },
      {
        username: "BlvckWlf",
        region: "EU",
        totalPoints: 206,
        combatTitle: "Combat Ace",
        tiers: {
          overall: "HT3",
          ltm: null,
          vanilla: "LT3",
          uhc: "HT1",
          pot: "LT2",
          nethop: "LT3",
          smp: "HT1",
          sword: "HT3",
          axe: "HT2",
          mace: "HT3"
        }
      },
      {
        username: "janekv",
        region: "EU",
        totalPoints: 199,
        combatTitle: "Combat Ace",
        tiers: {
          overall: "HT3",
          ltm: null,
          vanilla: "HT4",
          uhc: "LT2",
          pot: "HT1",
          nethop: "HT3",
          smp: "LT1",
          sword: "HT2",
          axe: "HT3",
          mace: null
        }
      },
      {
        username: "Lurrn",
        region: "EU",
        totalPoints: 186,
        combatTitle: "Combat Ace",
        tiers: {
          overall: "HT4",
          ltm: null,
          vanilla: "HT2",
          uhc: "LT3",
          pot: "HT1",
          nethop: "HT1",
          smp: null,
          sword: "LT2",
          axe: "LT4",
          mace: null
        }
      },
      {
        username: "yMiau",
        region: "EU",
        totalPoints: 177,
        combatTitle: "Combat Ace",
        tiers: {
          overall: "HT4",
          ltm: null,
          vanilla: "LT3",
          uhc: "LT1",
          pot: "LT3",
          nethop: "LT3",
          smp: "LT1",
          sword: "LT3",
          axe: "HT2",
          mace: "LT3"
        }
      },
      {
        username: "ninorc15",
        region: "EU",
        totalPoints: 171,
        combatTitle: "Combat Ace",
        tiers: {
          overall: "LT1",
          ltm: null,
          vanilla: "LT3",
          uhc: "HT2",
          pot: "LT2",
          nethop: "LT2",
          smp: "LT1",
          sword: "LT2",
          axe: "LT2",
          mace: "HT3"
        }
      },
      {
        username: "PvPLegend",
        region: "NA",
        totalPoints: 158,
        combatTitle: "Combat Expert",
        tiers: {
          overall: "LT1",
          ltm: "HT2",
          vanilla: "HT3",
          uhc: "LT2",
          pot: "HT3",
          nethop: "LT4",
          smp: "HT2",
          sword: "HT4",
          axe: "LT3",
          mace: "LT4"
        }
      },
      {
        username: "CrystalPvP",
        region: "EU",
        totalPoints: 145,
        combatTitle: "Combat Expert",
        tiers: {
          overall: "LT2",
          ltm: "LT3",
          vanilla: "LT4",
          uhc: "HT3",
          pot: "LT3",
          nethop: "HT4",
          smp: "LT2",
          sword: "LT3",
          axe: "HT4",
          mace: "HT4"
        }
      },
      {
        username: "NethGod",
        region: "AS",
        totalPoints: 132,
        combatTitle: "Combat Specialist",
        tiers: {
          overall: "LT2",
          ltm: null,
          vanilla: "HT4",
          uhc: "LT4",
          pot: "HT4",
          nethop: "HT2",
          smp: "LT3",
          sword: "LT4",
          axe: "LT4",
          mace: "LT3"
        }
      },
      {
        username: "AxeMaster",
        region: "SA",
        totalPoints: 119,
        combatTitle: "Combat Specialist",
        tiers: {
          overall: "LT3",
          ltm: "HT4",
          vanilla: "LT3",
          uhc: "HT4",
          pot: "LT4",
          nethop: "LT4",
          smp: "HT4",
          sword: "HT3",
          axe: "HT1",
          mace: "LT4"
        }
      },
      {
        username: "PotKing",
        region: "OC",
        totalPoints: 108,
        combatTitle: "Combat Specialist",
        tiers: {
          overall: "LT4",
          ltm: "LT4",
          vanilla: "LT4",
          uhc: "LT3",
          pot: "HT2",
          nethop: "LT3",
          smp: "LT4",
          sword: "HT4",
          axe: "HT4",
          mace: "HT4"
        }
      }
    ];

    for (const player of mockPlayers) {
      await this.createPlayer(player);
    }
    
    console.log(`Seeded ${mockPlayers.length} players to database`);
  }
}

export const storage = new DatabaseStorage();
