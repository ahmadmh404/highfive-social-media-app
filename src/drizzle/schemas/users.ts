import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  varchar,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================================================
// USERS TABLE
// ============================================================================

export const users = pgTable(
  "highfive_users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    username: varchar("username", { length: 100 }).unique().notNull(),
    passwordHash: text("password_hash").notNull(),
    name: varchar("full_name", { length: 255 }),
    bio: text("bio"),
    avatar: text("avatar"), // UploadThing URL
    coverImage: text("cover_image"),
    isEmailVerified: boolean("is_email_verified").default(false),
    isVerified: boolean("is_verified").default(false),
    isActive: boolean("is_active").default(true),
    lastLoginAt: timestamp("last_login_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    uniqueIndex().on(table.email),
    uniqueIndex().on(table.username),
    index().on(table.createdAt),
    index().on(table.isActive),
  ]
);

// ============================================================================
// SESSIONS TABLE
// ============================================================================

export const sessions = pgTable(
  "highfive_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").unique().notNull(),
    userAgent: text("user_agent"),
    ipAddress: varchar("ip_address", { length: 45 }),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index().on(table.userId), index().on(table.expiresAt)]
);

// ============================================================================
// USERS RELATIONS
// ============================================================================

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
  friendships: many(friendships),
  followers: many(followers),
  conversations: many(conversations),
  messages: many(messages),
  notifications: many(notifications),
  sessions: many(sessions),
}));

// Import other tables for relations
import { posts } from "./posts";
import { comments } from "./comments";
import { friendships } from "./social";
import { followers } from "./social";
import { conversations } from "./messaging";
import { messages } from "./messaging";
import { notifications } from "./notifications";
