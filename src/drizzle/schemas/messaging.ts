import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  json,
  varchar,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { media } from "./media";

// ============================================================================
// CONVERSATIONS TABLE
// ============================================================================

export const conversations = pgTable(
  "highfive_conversations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    participantIds: json("participant_ids").$type<string[]>().notNull(), // Array of user IDs
    isGroup: boolean("is_group").default(false),
    groupName: varchar("group_name", { length: 255 }),
    groupAvatar: text("group_avatar"), // UploadThing URL
    lastMessageAt: timestamp("last_message_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [index().on(table.createdAt)]
);

// ============================================================================
// MESSAGES TABLE
// ============================================================================

export const messages = pgTable(
  "highfive_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    senderId: uuid("sender_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    content: text("content"),
    mediaIds: json("media_ids").$type<string[]>(), // Array of media UUIDs
    readBy: json("read_by").$type<Record<string, string>>().default({}), // { userId: readAt timestamp }
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow(),
    deletedAt: timestamp("deleted_at"), // Soft delete
  },
  (table) => [
    index().on(table.conversationId),
    index().on(table.senderId),
    index().on(table.createdAt),
    index().on(table.deletedAt),
  ]
);

// ============================================================================
// MESSAGING RELATIONS
// ============================================================================

export const messagesRelations = relations(messages, ({ one, many }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(users, { fields: [messages.senderId], references: [users.id] }),
  media: many(media),
}));
