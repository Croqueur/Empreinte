import { pgTable, text, serial, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
});

export const familyMembers = pgTable("family_members", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  platformUserId: integer("platform_user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  x: integer("x").notNull().default(100),
  y: integer("y").notNull().default(100),
});

export const familyRelationships = pgTable("family_relationships", {
  id: serial("id").primaryKey(),
  parentId: integer("parent_id").notNull().references(() => familyMembers.id),
  childId: integer("child_id").notNull().references(() => familyMembers.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const memories = pgTable("memories", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  categoryId: integer("category_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categories = [
  { id: 1, name: "Early Life and Childhood", coverUrl: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800" },
  { id: 2, name: "Education", coverUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800" },
  { id: 3, name: "Career and Professional Life", coverUrl: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800" },
  { id: 4, name: "Personal Growth", coverUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800" },
  { id: 5, name: "Family and Relationships", coverUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800" },
  { id: 6, name: "Health and Well-being", coverUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800" },
  { id: 7, name: "Hobbies and Interests", coverUrl: "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?auto=format&fit=crop&w=800" },
  { id: 8, name: "Major Life Events", coverUrl: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800" },
  { id: 9, name: "Values and Beliefs", coverUrl: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=800" },
  { id: 10, name: "Legacy and Impact", coverUrl: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=800" },
  { id: 11, name: "Fun Memories", coverUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800" },
  { id: 12, name: "Dreams and Aspirations", coverUrl: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=800" }
];

// Schema for user insertion
export const insertUserSchema = createInsertSchema(users).extend({
  dateOfBirth: z.string().transform((str) => new Date(str)),
});

// Schema for family member insertion
export const insertFamilyMemberSchema = createInsertSchema(familyMembers).omit({ 
  id: true, 
  createdAt: true,
  platformUserId: true,
  x: true,
  y: true
}).extend({
  dateOfBirth: z.string(),
  platformUsername: z.string().optional(),
});

// Schema for memory insertion
export const insertMemorySchema = createInsertSchema(memories).omit({ id: true, createdAt: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertMemory = z.infer<typeof insertMemorySchema>;
export type InsertFamilyMember = z.infer<typeof insertFamilyMemberSchema>;
export type User = typeof users.$inferSelect;
export type Memory = typeof memories.$inferSelect;
export type FamilyMember = typeof familyMembers.$inferSelect;
export type FamilyRelationship = typeof familyRelationships.$inferSelect;
export type Category = typeof categories[number];