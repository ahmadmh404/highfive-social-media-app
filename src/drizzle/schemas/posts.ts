import {
  pgTable,
  text,
  timestamp,
  uuid,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

// ============================================================================
// POSTS TABLE
// ============================================================================

export const postPrivacyTypes = ["public", "friends", "private"] as const;
export type PostPrivacy = (typeof postPrivacyTypes)[number];
export const postPrivacyEnum = pgEnum("post_privacy", [
  "public",
  "friends",
  "private",
]);

export const posts = pgTable(
  "highfive_posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    privacy: postPrivacyEnum("privacy").default("public").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow(),
    deletedAt: timestamp("deleted_at"), // Soft delete
  },
  (table) => [
    index().on(table.userId),
    index().on(table.privacy),
    index().on(table.createdAt),
    index().on(table.deletedAt),
  ]
);

// ============================================================================
// POSTS RELATIONS
// ============================================================================

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, { fields: [posts.userId], references: [users.id] }),
  comments: many(comments),
  reactions: many(postReactions),
  bookmarks: many(bookmarks),
  media: many(media),
  tags: many(tags),
}));

// Import related tables
import { comments } from "./comments";
import { postReactions } from "./interactions";
import { bookmarks } from "./interactions";
import { media } from "./media";
import { tags } from "./tags";
