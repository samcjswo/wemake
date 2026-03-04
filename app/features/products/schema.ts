import { bigint, check, integer, jsonb, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { profiles } from "../users/schema";
import { sql } from "drizzle-orm";

export const products = pgTable("products", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  tagline: text().notNull(),
  description: text().notNull(),
  how_it_works: text().notNull(),
  icon: text().notNull(),
  url: text().notNull(),
  stats: jsonb().notNull().default({views:0, reviews:0}),
  profile_id: uuid().references(() => profiles.profile_id, { onDelete: "cascade" }),
  category_id: bigint({ mode: "number" }).references(() => categories.category_id, { onDelete: "set null" }),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  category_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  description: text().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const product_upvotes = pgTable("product_upvotes", {
    product_id: bigint({ mode: "number" }).references(() => products.id, { onDelete: "cascade" }),
    profile_id: uuid().references(() => profiles.profile_id, { onDelete: "cascade" }),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
}, (table) => [primaryKey({ columns: [table.product_id, table.profile_id] })]);

export const reviews = pgTable("reviews", {
    review_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    product_id: bigint({ mode: "number" }).references(() => products.id, { onDelete: "cascade" }),
    profile_id: uuid().references(() => profiles.profile_id, { onDelete: "cascade" }),
    rating: integer().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
}, (table) => [check('rating_check', sql`${table.rating} between 1 and 5`)]);

