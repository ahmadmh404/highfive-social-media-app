import {
  pgTable,
  uuid,
  timestamp,
  index,
  uniqueIndex,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

// ============================================================================
// FRIENDSHIPS TABLE
// ============================================================================

export const friendshipStatuses = ["pending", "accepted", "blocked"] as const;
export type FriendshipStatus = (typeof friendshipStatuses)[number];
export const friendshipStatusEnum = pgEnum("friendship_status", [
  "pending",
  "accepted",
  "blocked",
]);

export const friendships = pgTable(
  "highfive_friendships",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    friendId: uuid("friend_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: friendshipStatusEnum("status").default("pending").notNull(),
    requestedAt: timestamp("requested_at").defaultNow(),
    acceptedAt: timestamp("accepted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index().on(table.userId),
    index().on(table.friendId),
    index().on(table.status),
    uniqueIndex().on(table.userId, table.friendId),
  ]
);

// ============================================================================
// FOLLOWERS TABLE
// ============================================================================

export const followers = pgTable(
  "highfive_followers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    followerId: uuid("follower_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index().on(table.userId),
    index().on(table.followerId),
    uniqueIndex().on(table.userId, table.followerId),
  ]
);

// ============================================================================
// SOCIAL RELATIONS
// ============================================================================

export const friendshipsRelations = relations(friendships, ({ one }) => ({
  user: one(users, { fields: [friendships.userId], references: [users.id] }),
  friend: one(users, {
    fields: [friendships.friendId],
    references: [users.id],
  }),
}));
