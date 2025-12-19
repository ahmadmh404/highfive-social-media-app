import {
  pgTable,
  uuid,
  text,
  timestamp,
  varchar,
  json,
  smallint,
  serial,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

// ============================================================================
// AUDIT LOGS TABLE
// ============================================================================

export const auditLogs = pgTable(
  "highfive_audit_logs",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    action: varchar("action", { length: 100 }).notNull(),
    resource: varchar("resource", { length: 100 }).notNull(),
    resourceId: uuid("resource_id"),
    changes: json("changes"), // What changed
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    statusCode: smallint("status_code"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index().on(table.userId),
    index().on(table.action),
    index().on(table.resource),
    index().on(table.createdAt),
  ]
);

// ============================================================================
// AUDIT LOGS RELATIONS
// ============================================================================

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));
