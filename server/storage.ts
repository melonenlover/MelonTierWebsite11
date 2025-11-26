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
