import { sql } from "drizzle-orm";
import { bigint, check, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const teams = pgTable("teams", {
  team_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  product_name: text().notNull(),
  team_size: integer().notNull(),
  equity_split: integer().notNull(),
  roles: text().notNull(),
  product_description: text().notNull(),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull(),
}, (table) => [check('team_size_check', sql`${table.team_size} between 1 and 100`), check('equity_split_check', sql`${table.equity_split} between 1 and 100`)]);