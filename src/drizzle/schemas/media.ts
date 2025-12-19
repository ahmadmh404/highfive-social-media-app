import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  varchar,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { posts } from "./posts";
import { stories } from "./stories";
import { messages } from "./messaging";

// ============================================================================
// MEDIA TABLE
// ============================================================================

export const mediaTypes = ["image", "video", "audio", "document"] as const;
export type MediaType = (typeof mediaTypes)[number];
export const mediaTypeEnum = pgEnum("media_type", mediaTypes);

export const media = pgTable(
  "highfive_media",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    postId: uuid("post_id").references(() => posts.id, { onDelete: "cascade" }),
    storyId: uuid("story_id").references(() => stories.id, {
      onDelete: "cascade",
    }),
    messageId: uuid("message_id").references(() => messages.id, {
      onDelete: "cascade",
    }),
    uploadThingKey: text("uploadthing_key").unique().notNull(),
    uploadThingUrl: text("uploadthing_url").notNull(),
    type: mediaTypeEnum("type").notNull(),
    mimeType: varchar("mime_type", { length: 100 }),
    size: integer("size"), // in bytes
    duration: integer("duration"), // for videos in seconds
    width: integer("width"), // for images
    height: integer("height"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index().on(table.userId),
    index().on(table.postId),
    index().on(table.storyId),
    index().on(table.messageId),
  ]
);

// ============================================================================
// MEDIA RELATIONS
// ============================================================================

export const mediaRelations = relations(media, ({ one }) => ({
  user: one(users, { fields: [media.userId], references: [users.id] }),
  post: one(posts, { fields: [media.postId], references: [posts.id] }),
  story: one(stories, { fields: [media.storyId], references: [stories.id] }),
  message: one(messages, {
    fields: [media.messageId],
    references: [messages.id],
  }),
}));
