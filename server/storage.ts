import { type Player, type InsertPlayer, type GameMode, type TierLevel } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAllPlayers(): Promise<Player[]>;
  getPlayersByGameMode(gameMode: GameMode): Promise<Player[]>;
  getPlayerById(id: string): Promise<Player | undefined>;
  searchPlayers(query: string): Promise<Player[]>;
  createPlayer(player: InsertPlayer): Promise<Player>;
}

export class MemStorage implements IStorage {
  private players: Map<string, Player>;

  constructor() {
    this.players = new Map();
    this.initializeMockData();
  }

  private initializeMockData() {
    const mockPlayers: Array<Omit<Player, "id"> & { tiers: Record<GameMode, TierLevel> }> = [
      {
        username: "MelonKing",
        region: "NA",
        totalPoints: 485,
        combatTitle: "Combat Grandmaster",
        tiers: {
          overall: "HT1",
          melon: "HT1",
          watermelon: "HT1",
          cantaloupe: "LT1",
          honeydew: "LT1",
          sweet: "HT2",
          garden: "HT1",
          summer: "LT2",
          tropical: "LT1"
        }
      },
      {
        username: "FruitNinja",
        region: "EU",
        totalPoints: 412,
        combatTitle: "Combat Master",
        tiers: {
          overall: "HT1",
          melon: "HT2",
          watermelon: "HT1",
          cantaloupe: "HT1",
          honeydew: "LT2",
          sweet: "HT1",
          garden: "LT1",
          summer: "HT2",
          tropical: "LT3"
        }
      },
      {
        username: "SweetSlice",
        region: "NA",
        totalPoints: 387,
        combatTitle: "Combat Master",
        tiers: {
          overall: "HT2",
          melon: "HT1",
          watermelon: "LT2",
          cantaloupe: "HT2",
          honeydew: "HT1",
          sweet: "HT1",
          garden: "LT2",
          summer: "HT3",
          tropical: "LT2"
        }
      },
      {
        username: "GardenWarrior",
        region: "AS",
        totalPoints: 356,
        combatTitle: "Combat Ace",
        tiers: {
          overall: "HT2",
          melon: "LT3",
          watermelon: "HT2",
          cantaloupe: "LT1",
          honeydew: "HT2",
          sweet: "LT2",
          garden: "HT1",
          summer: "LT1",
          tropical: "HT3"
        }
      },
      {
        username: "TropicalStorm",
        region: "SA",
        totalPoints: 329,
        combatTitle: "Combat Ace",
        tiers: {
          overall: "HT3",
          melon: "LT2",
          watermelon: "LT3",
          cantaloupe: "HT3",
          honeydew: "LT3",
          sweet: "HT2",
          garden: "LT1",
          summer: "HT1",
          tropical: "HT1"
        }
      },
      {
        username: "HoneyChampion",
        region: "EU",
        totalPoints: 298,
        combatTitle: "Combat Ace",
        tiers: {
          overall: "HT3",
          melon: "LT4",
          watermelon: "HT3",
          cantaloupe: "LT2",
          honeydew: "HT1",
          sweet: "LT3",
          garden: "HT2",
          summer: "LT2",
          tropical: "LT4"
        }
      },
      {
        username: "SummerVibes",
        region: "OC",
        totalPoints: 276,
        combatTitle: "Combat Expert",
        tiers: {
          overall: "HT4",
          melon: "HT3",
          watermelon: "LT4",
          cantaloupe: "HT2",
          honeydew: "LT2",
          sweet: "LT4",
          garden: "LT3",
          summer: "HT1",
          tropical: "HT2"
        }
      },
      {
        username: "CantaloupeCrusher",
        region: "NA",
        totalPoints: 254,
        combatTitle: "Combat Expert",
        tiers: {
          overall: "HT4",
          melon: "LT3",
          watermelon: "HT4",
          cantaloupe: "HT1",
          honeydew: "HT3",
          sweet: "LT3",
          garden: "LT4",
          summer: "HT3",
          tropical: "LT3"
        }
      },
      {
        username: "WatermelonWizard",
        region: "EU",
        totalPoints: 231,
        combatTitle: "Combat Expert",
        tiers: {
          overall: "LT1",
          melon: "HT4",
          watermelon: "HT1",
          cantaloupe: "LT3",
          honeydew: "LT4",
          sweet: "HT3",
          garden: "HT3",
          summer: "LT4",
          tropical: "HT4"
        }
      },
      {
        username: "MelonMaster92",
        region: "AS",
        totalPoints: 218,
        combatTitle: "Combat Specialist",
        tiers: {
          overall: "LT1",
          melon: "HT2",
          watermelon: "LT2",
          cantaloupe: "LT4",
          honeydew: "HT4",
          sweet: "LT2",
          garden: "HT4",
          summer: "HT2",
          tropical: "LT2"
        }
      },
      {
        username: "JuicyDefender",
        region: "NA",
        totalPoints: 197,
        combatTitle: "Combat Specialist",
        tiers: {
          overall: "LT2",
          melon: "LT2",
          watermelon: "HT3",
          cantaloupe: "HT4",
          honeydew: "LT3",
          sweet: "HT4",
          garden: "LT2",
          summer: "LT3",
          tropical: "HT3"
        }
      },
      {
        username: "SeedSlayer",
        region: "EU",
        totalPoints: 175,
        combatTitle: "Combat Specialist",
        tiers: {
          overall: "LT2",
          melon: "HT3",
          watermelon: "LT3",
          cantaloupe: "HT3",
          honeydew: "HT3",
          sweet: "LT4",
          garden: "LT4",
          summer: "HT4",
          tropical: "LT4"
        }
      },
      {
        username: "RipeRavager",
        region: "SA",
        totalPoints: 156,
        combatTitle: "Combat Specialist",
        tiers: {
          overall: "LT3",
          melon: "LT4",
          watermelon: "HT2",
          cantaloupe: "LT4",
          honeydew: "LT4",
          sweet: "HT4",
          garden: "HT4",
          summer: "LT4",
          tropical: "HT2"
        }
      },
      {
        username: "GreenGuardian",
        region: "OC",
        totalPoints: 142,
        combatTitle: "Combat Specialist",
        tiers: {
          overall: "LT3",
          melon: "LT3",
          watermelon: "LT4",
          cantaloupe: "HT4",
          honeydew: "HT2",
          sweet: "LT3",
          garden: "HT2",
          summer: "HT3",
          tropical: "LT4"
        }
      },
      {
        username: "FreshPicker",
        region: "AS",
        totalPoints: 128,
        combatTitle: "Combat Specialist",
        tiers: {
          overall: "LT4",
          melon: "HT4",
          watermelon: "HT4",
          cantaloupe: "LT3",
          honeydew: "LT3",
          sweet: "LT4",
          garden: "LT3",
          summer: "HT4",
          tropical: "HT4"
        }
      }
    ];

    mockPlayers.forEach((playerData) => {
      const id = randomUUID();
      const player: Player = { ...playerData, id };
      this.players.set(id, player);
    });
  }

  async getAllPlayers(): Promise<Player[]> {
    return Array.from(this.players.values())
      .sort((a, b) => b.totalPoints - a.totalPoints);
  }

  async getPlayersByGameMode(gameMode: GameMode): Promise<Player[]> {
    const allPlayers = Array.from(this.players.values());
    
    if (gameMode === "overall") {
      return allPlayers.sort((a, b) => b.totalPoints - a.totalPoints);
    }

    const playersWithTier = allPlayers
      .filter(p => p.tiers[gameMode] !== null)
      .map(p => ({
        ...p,
        gameTier: p.tiers[gameMode] as TierLevel
      }))
      .sort((a, b) => {
        const tierA = a.gameTier as string;
        const tierB = b.gameTier as string;
        
        const getTierScore = (tier: string): number => {
          if (tier.startsWith("HT")) {
            return 100 - parseInt(tier.slice(2));
          }
          return 50 - parseInt(tier.slice(2));
        };
        
        return getTierScore(tierB) - getTierScore(tierA);
      });

    return playersWithTier;
  }

  async getPlayerById(id: string): Promise<Player | undefined> {
    return this.players.get(id);
  }

  async searchPlayers(query: string): Promise<Player[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.players.values())
      .filter(p => p.username.toLowerCase().includes(searchTerm))
      .sort((a, b) => b.totalPoints - a.totalPoints);
  }

  async createPlayer(insertPlayer: InsertPlayer): Promise<Player> {
    const id = randomUUID();
    const player: Player = { 
      id,
      username: insertPlayer.username,
      region: insertPlayer.region,
      totalPoints: insertPlayer.totalPoints,
      combatTitle: insertPlayer.combatTitle,
      tiers: insertPlayer.tiers,
      avatarUrl: insertPlayer.avatarUrl
    };
    this.players.set(id, player);
    return player;
  }
}

export const storage = new MemStorage();
