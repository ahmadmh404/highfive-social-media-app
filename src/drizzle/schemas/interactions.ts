import {
  pgTable,
  uuid,
  text,
  timestamp,
  varchar,
  boolean,
  index,
  uniqueIndex,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { posts } from "./posts";
import { comments } from "./comments";

// ============================================================================
// POST REACTIONS TABLE
// ============================================================================

export const reactionTypes = ["like", "love", "haha", "sad", "angry"] as const;
export type ReactionType = (typeof reactionTypes)[number];
export const reactionTypeEnum = pgEnum("reaction_type", reactionTypes);

export const postReactions = pgTable(
  "highfive_post_reactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: reactionTypeEnum("type").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index().on(table.postId),
    index().on(table.userId),
    uniqueIndex().on(table.postId, table.userId),
  ]
);

// ============================================================================
// COMMENT REACTIONS TABLE
// ============================================================================

export const commentReactions = pgTable(
  "highfive_comment_reactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    commentId: uuid("comment_id")
      .notNull()
      .references(() => comments.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: reactionTypeEnum("type").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index().on(table.commentId), index().on(table.userId)]
);

// ============================================================================
// BOOKMARKS TABLE
// ============================================================================

export const bookmarks = pgTable(
  "highfive_bookmarks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    collectionId: uuid("collection_id").references(() => collections.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index().on(table.userId),
    index().on(table.postId),
    index().on(table.collectionId),
  ]
);

// ============================================================================
// COLLECTIONS TABLE
// ============================================================================

export const collections = pgTable(
  "highfive_collections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    isPublic: boolean("is_public").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [index().on(table.userId)]
);

// ============================================================================
// INTERACTIONS RELATIONS
// ============================================================================

export const collectionsRelations = relations(collections, ({ one, many }) => ({
  user: one(users, { fields: [collections.userId], references: [users.id] }),
  bookmarks: many(bookmarks),
}));
