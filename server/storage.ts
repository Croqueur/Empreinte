import { InsertUser, InsertMemory, InsertFamilyMember, User, Memory, FamilyMember, FamilyRelationship, categories } from "@shared/schema";
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

  getFamilyMembers(userId: number): Promise<FamilyMember[]>;
  getFamilyMember(id: number): Promise<FamilyMember | undefined>;
  createFamilyMember(member: InsertFamilyMember): Promise<FamilyMember>;
  updateFamilyMemberPosition(id: number, x: number, y: number): Promise<void>;
  linkFamilyMemberToUser(memberId: number, platformUserId: number): Promise<void>;

  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private memories: Map<number, Memory>;
  private familyMembers: Map<number, FamilyMember>;
  private currentUserId: number;
  private currentMemoryId: number;
  private currentFamilyMemberId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.memories = new Map();
    this.familyMembers = new Map();
    this.currentUserId = 1;
    this.currentMemoryId = 1;
    this.currentFamilyMemberId = 1;
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
    const user: User = { 
      ...insertUser, 
      id,
      dateOfBirth: new Date(insertUser.dateOfBirth).toISOString()
    };
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
      imageUrl: insertMemory.imageUrl || null,
    };
    this.memories.set(id, memory);
    return memory;
  }

  async deleteMemory(id: number): Promise<void> {
    this.memories.delete(id);
  }

  async getFamilyMembers(userId: number): Promise<FamilyMember[]> {
    return Array.from(this.familyMembers.values()).filter(
      (member) => member.userId === userId
    );
  }

  async getFamilyMember(id: number): Promise<FamilyMember | undefined> {
    return this.familyMembers.get(id);
  }

  async createFamilyMember(insertMember: InsertFamilyMember): Promise<FamilyMember> {
    const id = this.currentFamilyMemberId++;
    const member: FamilyMember = {
      ...insertMember,
      id,
      createdAt: new Date(),
      platformUserId: null,
      dateOfBirth: new Date(insertMember.dateOfBirth).toISOString(),
      x: 100,
      y: 100
    };
    this.familyMembers.set(id, member);
    return member;
  }

  async updateFamilyMemberPosition(id: number, x: number, y: number): Promise<void> {
    const member = this.familyMembers.get(id);
    if (member) {
      this.familyMembers.set(id, { ...member, x, y });
    }
  }

  async linkFamilyMemberToUser(memberId: number, platformUserId: number): Promise<void> {
    const member = this.familyMembers.get(memberId);
    if (member) {
      this.familyMembers.set(memberId, { ...member, platformUserId });
    }
  }
}

export const storage = new MemStorage();