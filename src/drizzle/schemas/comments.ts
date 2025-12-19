import { pgTable, text, timestamp, uuid, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { posts } from "./posts";
import { commentReactions } from "./interactions";
import { tags } from "./tags";

export const comments = pgTable(
  "highfive_comments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    content: text("content"),
    media: text("media"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow(),
    deletedAt: timestamp("deleted_at"), // Soft delete
  },
  (table) => [
    index().on(table.postId),
    index().on(table.userId),
    index().on(table.deletedAt),
  ]
);

// ============================================================================
// COMMENTS RELATIONS
// ============================================================================

export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, { fields: [comments.postId], references: [posts.id] }),
  user: one(users, { fields: [comments.userId], references: [users.id] }),
  reactions: many(commentReactions),
  tags: many(tags),
}));
