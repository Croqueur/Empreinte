import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
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
  { id: 1, name: "Early Life and Childhood", coverUrl: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55" },
  { id: 2, name: "Education", coverUrl: "https://images.unsplash.com/photo-1609667645138-e2b2e248a384" },
  { id: 3, name: "Career and Professional Life", coverUrl: "https://images.unsplash.com/photo-1609667678863-b6971ef1e63d" },
  { id: 4, name: "Personal Growth", coverUrl: "https://images.unsplash.com/photo-1582485939877-519c2e06750c" },
  { id: 5, name: "Family and Relationships", coverUrl: "https://images.unsplash.com/photo-1732950105499-e4aa03d6bc4c" },
  { id: 6, name: "Health and Well-being", coverUrl: "https://images.unsplash.com/photo-1666185761628-00a3655f4f7b" },
  { id: 7, name: "Hobbies and Interests", coverUrl: "https://images.unsplash.com/photo-1711602926101-faf831f56803" },
  { id: 8, name: "Major Life Events", coverUrl: "https://images.unsplash.com/photo-1533024115551-3925e1b0cd51" },
  { id: 9, name: "Values and Beliefs", coverUrl: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d" },
  { id: 10, name: "Legacy and Impact", coverUrl: "https://images.unsplash.com/photo-1549638441-b787d2e11f14" },
  { id: 11, name: "Fun Memories", coverUrl: "https://images.unsplash.com/photo-1572805688879-63df2a286844" },
  { id: 12, name: "Dreams and Aspirations", coverUrl: "https://images.unsplash.com/photo-1705579296593-2194f6ad7883" }
];

export const insertUserSchema = createInsertSchema(users);
export const insertMemorySchema = createInsertSchema(memories).omit({ id: true, createdAt: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertMemory = z.infer<typeof insertMemorySchema>;
export type User = typeof users.$inferSelect;
export type Memory = typeof memories.$inferSelect;
export type Category = typeof categories[number];
