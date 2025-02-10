import { InsertUser, InsertMemory, User, Memory, categories } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getMemories(userId: number): Promise<Memory[]>;
  getMemoriesByCategory(userId: number, categoryId: number): Promise<Memory[]>;
  createMemory(memory: InsertMemory): Promise<Memory>;
  deleteMemory(id: number): Promise<void>;
  
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private memories: Map<number, Memory>;
  private currentUserId: number;
  private currentMemoryId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.memories = new Map();
    this.currentUserId = 1;
    this.currentMemoryId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getMemories(userId: number): Promise<Memory[]> {
    return Array.from(this.memories.values()).filter(
      (memory) => memory.userId === userId,
    );
  }

  async getMemoriesByCategory(userId: number, categoryId: number): Promise<Memory[]> {
    return Array.from(this.memories.values()).filter(
      (memory) => memory.userId === userId && memory.categoryId === categoryId,
    );
  }

  async createMemory(insertMemory: InsertMemory): Promise<Memory> {
    const id = this.currentMemoryId++;
    const memory: Memory = {
      ...insertMemory,
      id,
      createdAt: new Date(),
    };
    this.memories.set(id, memory);
    return memory;
  }

  async deleteMemory(id: number): Promise<void> {
    this.memories.delete(id);
  }
}

export const storage = new MemStorage();
