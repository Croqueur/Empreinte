import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertMemorySchema, insertFamilyMemberSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Memory routes
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

  // Family member routes
  app.get("/api/family-members", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const members = await storage.getFamilyMembers(req.user.id);
    res.json(members);
  });

  app.post("/api/family-members", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const result = insertFamilyMemberSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(result.error);
    }

    const member = await storage.createFamilyMember({
      ...result.data,
      userId: req.user.id,
    });
    res.status(201).json(member);
  });

  app.patch("/api/family-members/:id/position", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { x, y } = req.body;
    await storage.updateFamilyMemberPosition(parseInt(req.params.id), x, y);
    res.sendStatus(200);
  });

  app.post("/api/family-members/:id/link", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { platformUserId } = req.body;
    await storage.linkFamilyMemberToUser(parseInt(req.params.id), platformUserId);
    res.sendStatus(200);
  });

  // User search route for family member linking
  app.get("/api/users/search", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const query = req.query.q as string;
    if (!query) return res.json([]);

    // Simple in-memory search implementation
    const allUsers = Array.from(storage.users.values());
    const results = allUsers.filter(user =>
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.fullName.toLowerCase().includes(query.toLowerCase())
    );

    res.json(results.map(({ id, username, fullName }) => ({ id, username, fullName })));
  });

  const httpServer = createServer(app);
  return httpServer;
}