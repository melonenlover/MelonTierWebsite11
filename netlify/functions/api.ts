import express, { type Request, type Response, type NextFunction } from "express";
import serverless from "serverless-http";
import { storage } from "../../server/storage-serverless";
import { gameModes } from "../../shared/types";

const app = express();
const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

router.get("/rankings/:gameMode", async (req: Request, res: Response) => {
  try {
    const { gameMode } = req.params;
    
    const validGameModes = [...gameModes];
    if (!validGameModes.includes(gameMode as any)) {
      return res.status(400).json({ 
        error: "Invalid game mode",
        validModes: validGameModes 
      });
    }

    const players = await storage.getPlayersByGameMode(gameMode as any);
    res.json(players);
  } catch (error) {
    console.error("Error fetching rankings:", error);
    res.status(500).json({ error: "Failed to fetch rankings" });
  }
});

router.get("/rankings", async (_req: Request, res: Response) => {
  try {
    const players = await storage.getAllPlayers();
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

    const players = await storage.searchPlayers(query);
    res.json(players);
  } catch (error) {
    console.error("Error searching players:", error);
    res.status(500).json({ error: "Failed to search players" });
  }
});

router.get("/players/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const player = await storage.getPlayerById(id);
    
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
    const count = await storage.getPlayerCount();
    res.json({ count });
  } catch (error) {
    console.error("Error fetching player count:", error);
    res.status(500).json({ error: "Failed to fetch player count" });
  }
});

app.use("/.netlify/functions/api", router);

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

export const handler = serverless(app);
