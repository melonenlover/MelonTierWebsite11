import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { gameModes, insertPlayerSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Seed initial data if database is empty
  await storage.seedInitialData();
  
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

  // Get player by ID (Discord ID)
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

  // Get all available game modes
  app.get("/api/gamemodes", async (req, res) => {
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

  // Create a new player
  app.post("/api/players", async (req, res) => {
    try {
      const validatedData = insertPlayerSchema.parse(req.body);
      const player = await storage.createPlayer(validatedData);
      res.status(201).json(player);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid player data", details: error.errors });
      }
      console.error("Error creating player:", error);
      res.status(500).json({ error: "Failed to create player" });
    }
  });

  // Update a player
  app.patch("/api/players/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const player = await storage.updatePlayer(id, updates);
      
      if (!player) {
        return res.status(404).json({ error: "Player not found" });
      }

      res.json(player);
    } catch (error) {
      console.error("Error updating player:", error);
      res.status(500).json({ error: "Failed to update player" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
