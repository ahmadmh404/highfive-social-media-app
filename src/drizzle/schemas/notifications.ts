import {
  pgTable,
  uuid,
  boolean,
  text,
  timestamp,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { posts } from "./posts";
import { comments } from "./comments";

// ============================================================================
// NOTIFICATIONS TABLE
// ============================================================================

export const notificationTypes = [
  "like",
  "comment",
  "follow",
  "friend_request",
  "message",
  "post_mention",
] as const;
export type NotificationType = (typeof notificationTypes)[number];

export const notificationTypeEnum = pgEnum("notification_type", [
  "like",
  "comment",
  "follow",
  "friend_request",
  "message",
  "post_mention",
]);

export const notifications = pgTable(
  "highfive_notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: notificationTypeEnum("type").notNull(),
    relatedUserId: uuid("related_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    relatedPostId: uuid("related_post_id").references(() => posts.id, {
      onDelete: "set null",
    }),
    relatedCommentId: uuid("related_comment_id").references(() => comments.id, {
      onDelete: "set null",
    }),
    message: text("message"),
    isRead: boolean("is_read").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index().on(table.userId),
    index().on(table.isRead),
    index().on(table.createdAt),
  ]
);

// ============================================================================
// NOTIFICATIONS RELATIONS
// ============================================================================

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
  relatedUser: one(users, {
    fields: [notifications.relatedUserId],
    references: [users.id],
  }),
  relatedPost: one(posts, {
    fields: [notifications.relatedPostId],
    references: [posts.id],
  }),
  relatedComment: one(comments, {
    fields: [notifications.relatedCommentId],
    references: [comments.id],
  }),
}));
