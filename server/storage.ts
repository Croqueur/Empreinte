import { InsertUser, InsertMemory, InsertFamilyMember, User, Memory, FamilyMember, users, memories, familyMembers } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getMemories(userId: number): Promise<Memory[]>;
  getMemoriesByCategory(userId: number, categoryId: number): Promise<Memory[]>;
  createMemory(memory: InsertMemory): Promise<Memory>;
  deleteMemory(id: number): Promise<void>;

  getFamilyMembers(userId: number): Promise<FamilyMember[]>;
  getFamilyMember(id: number): Promise<FamilyMember | undefined>;
  createFamilyMember(member: InsertFamilyMember): Promise<FamilyMember>;
  updateFamilyMemberPosition(id: number, x: number, y: number): Promise<void>;
  linkFamilyMemberToUser(memberId: number, platformUserId: number): Promise<void>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getMemories(userId: number): Promise<Memory[]> {
    return db.select().from(memories).where(eq(memories.userId, userId));
  }

  async getMemoriesByCategory(userId: number, categoryId: number): Promise<Memory[]> {
    return db.select()
      .from(memories)
      .where(eq(memories.userId, userId))
      .where(eq(memories.categoryId, categoryId));
  }

  async createMemory(insertMemory: InsertMemory): Promise<Memory> {
    const [memory] = await db.insert(memories).values(insertMemory).returning();
    return memory;
  }

  async deleteMemory(id: number): Promise<void> {
    await db.delete(memories).where(eq(memories.id, id));
  }

  async getFamilyMembers(userId: number): Promise<FamilyMember[]> {
    return db.select().from(familyMembers).where(eq(familyMembers.userId, userId));
  }

  async getFamilyMember(id: number): Promise<FamilyMember | undefined> {
    const [member] = await db.select().from(familyMembers).where(eq(familyMembers.id, id));
    return member;
  }

  async createFamilyMember(insertMember: InsertFamilyMember): Promise<FamilyMember> {
    const [member] = await db.insert(familyMembers).values({
      ...insertMember,
      platformUserId: null,
      x: 100,
      y: 100
    }).returning();
    return member;
  }

  async updateFamilyMemberPosition(id: number, x: number, y: number): Promise<void> {
    await db.update(familyMembers)
      .set({ x, y })
      .where(eq(familyMembers.id, id));
  }

  async linkFamilyMemberToUser(memberId: number, platformUserId: number): Promise<void> {
    await db.update(familyMembers)
      .set({ platformUserId })
      .where(eq(familyMembers.id, memberId));
  }
}

export const storage = new DatabaseStorage();