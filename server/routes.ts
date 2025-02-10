import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertMemorySchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  app.get("/api/memories", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const memories = await storage.getMemories(req.user.id);
    res.json(memories);
  });

  app.get("/api/memories/:categoryId", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const categoryId = parseInt(req.params.categoryId);
    const memories = await storage.getMemoriesByCategory(req.user.id, categoryId);
    res.json(memories);
  });

  app.post("/api/memories", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const result = insertMemorySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(result.error);
    }

    const memory = await storage.createMemory({
      ...result.data,
      userId: req.user.id,
    });
    res.status(201).json(memory);
  });

  app.delete("/api/memories/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    await storage.deleteMemory(parseInt(req.params.id));
    res.sendStatus(204);
  });

  const httpServer = createServer(app);
  return httpServer;
}
