import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { gameModes } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get rankings by game mode
  app.get("/api/rankings/:gameMode", async (req, res) => {
    try {
      const { gameMode } = req.params;
      
      // Validate game mode
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

  // Get all players (overall rankings)
  app.get("/api/rankings", async (req, res) => {
    try {
      const players = await storage.getAllPlayers();
      res.json(players);
    } catch (error) {
      console.error("Error fetching all players:", error);
      res.status(500).json({ error: "Failed to fetch players" });
    }
  });

  // Search players by username
  app.get("/api/players/search/:query", async (req, res) => {
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

  // Get player by ID
  app.get("/api/players/:id", async (req, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
