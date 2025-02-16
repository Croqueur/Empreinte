import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertMemorySchema, insertFamilyMemberSchema } from "@shared/schema";
import { eq, or, ilike } from "drizzle-orm";
import { users, memories } from "@shared/schema";
import { db } from "./db";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Memory routes
  app.get("/api/memories", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const memories = await storage.getMemories(req.user.id);
    res.json(memories);
  });

  // Get memories for feed (shared memories)
  app.get("/api/memories/shared", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      // For now, return all memories as shared - you can implement proper sharing logic later
      const sharedMemories = await db
        .select()
        .from(memories)
        .limit(20); // Limit to recent 20 memories
      res.json(sharedMemories);
    } catch (error) {
      console.error('Error fetching shared memories:', error);
      res.status(500).json({ error: "Failed to fetch shared memories" });
    }
  });

  app.get("/api/memories/:categoryId", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const categoryId = parseInt(req.params.categoryId);
      if (isNaN(categoryId)) {
        return res.status(400).json({ error: "Invalid category ID" });
      }
      const memories = await storage.getMemoriesByCategory(req.user.id, categoryId);
      res.json(memories);
    } catch (error) {
      console.error('Error fetching memories:', error);
      res.status(500).json({ error: "Failed to fetch memories" });
    }
  });

  app.post("/api/memories", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const result = insertMemorySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(result.error);
    }

    try {
      const memory = await storage.createMemory({
        ...result.data,
        userId: req.user.id,
      });
      res.status(201).json(memory);
    } catch (error) {
      console.error('Error creating memory:', error);
      res.status(500).json({ error: "Failed to create memory" });
    }
  });

  app.delete("/api/memories/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      await storage.deleteMemory(parseInt(req.params.id));
      res.sendStatus(204);
    } catch (error) {
      console.error('Error deleting memory:', error);
      res.status(500).json({ error: "Failed to delete memory" });
    }
  });

  // Family member routes
  app.get("/api/family-members", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const members = await storage.getFamilyMembers(req.user.id);
      res.json(members);
    } catch (error) {
      console.error('Error fetching family members:', error);
      res.status(500).json({ error: "Failed to fetch family members" });
    }
  });

  app.post("/api/family-members", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const result = insertFamilyMemberSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(result.error);
    }

    try {
      const member = await storage.createFamilyMember({
        ...result.data,
        userId: req.user.id,
      });
      res.status(201).json(member);
    } catch (error) {
      console.error('Error creating family member:', error);
      res.status(500).json({ error: "Failed to create family member" });
    }
  });

  app.patch("/api/family-members/:id/position", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const { x, y } = req.body;
      await storage.updateFamilyMemberPosition(parseInt(req.params.id), x, y);
      res.sendStatus(200);
    } catch (error) {
      console.error('Error updating member position:', error);
      res.status(500).json({ error: "Failed to update member position" });
    }
  });

  app.post("/api/family-members/:id/link", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const { platformUserId } = req.body;
      await storage.linkFamilyMemberToUser(parseInt(req.params.id), platformUserId);
      res.sendStatus(200);
    } catch (error) {
      console.error('Error linking member to user:', error);
      res.status(500).json({ error: "Failed to link member to user" });
    }
  });

  // User search route for family member linking
  app.get("/api/users/search", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const query = req.query.q as string;
    if (!query) return res.json([]);

    try {
      const results = await db.select({
        id: users.id,
        username: users.username,
        fullName: users.fullName,
      })
        .from(users)
        .where(
          or(
            ilike(users.username, `%${query}%`),
            ilike(users.fullName, `%${query}%`)
          )
        )
        .limit(10);

      res.json(results);
    } catch (error) {
      console.error('Error searching users:', error);
      res.status(500).json({ error: "Failed to search users" });
    }
  });

  // Update the progress endpoint to use clearer naming
  app.get("/api/categories/:id/progress", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const categoryId = parseInt(req.params.id);
      if (isNaN(categoryId)) {
        return res.status(400).json({ error: "Invalid category ID" });
      }

      const memoriesCount = await storage.getAnsweredPromptCount(req.user.id, categoryId);
      const totalPossibleMemories = await storage.getTotalPromptsPerCategory(categoryId);

      res.json({ 
        answered: memoriesCount, 
        total: totalPossibleMemories 
      });
    } catch (error) {
      console.error('Error fetching category progress:', error);
      res.status(500).json({ error: "Failed to fetch category progress" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}