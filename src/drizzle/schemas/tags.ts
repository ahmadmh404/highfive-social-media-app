import { pgTable, uuid, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./users";
import { posts } from "./posts";
import { comments } from "./comments";

// ============================================================================
// TAGS TABLE
// ============================================================================

export const tags = pgTable(
  "highfive_tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id").references(() => posts.id, { onDelete: "cascade" }),
    commentId: uuid("comment_id").references(() => comments.id, {
      onDelete: "cascade",
    }),
    taggedUserId: uuid("tagged_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index().on(table.postId),
    index().on(table.commentId),
    index().on(table.taggedUserId),
  ]
);
