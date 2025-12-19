import {
  pgTable,
  text,
  timestamp,
  uuid,
  json,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

// ============================================================================
// STORIES TABLE
// ============================================================================

export const stories = pgTable(
  "highfive_stories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    mediaIds: json("media_ids").$type<string[]>(), // Array of media UUIDs
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index().on(table.userId), index().on(table.expiresAt)]
);

// ============================================================================
// STORY VIEWS TABLE
// ============================================================================

export const storyViews = pgTable(
  "highfive_story_views",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    storyId: uuid("story_id")
      .notNull()
      .references(() => stories.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    viewedAt: timestamp("viewed_at").defaultNow().notNull(),
  },
  (table) => [index().on(table.storyId), index().on(table.userId)]
);

// ============================================================================
// STORIES RELATIONS
// ============================================================================

export const storiesRelations = relations(stories, ({ one, many }) => ({
  user: one(users, { fields: [stories.userId], references: [users.id] }),
  views: many(storyViews),
  media: many(media),
}));

// Import related tables
import { media } from "./media";
