import { jsonb, pgEnum, pgSchema, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgSchema("auth").table("users", {
  id: uuid().primaryKey(),
});

export const roles = pgEnum("role", [
    "developer",
    "founder",
    "marketer",
    "product_manager",
    "designer",
    "other",
  ]);

export const profiles = pgTable("profiles", {
  profile_id: uuid().primaryKey().references(() => users.id),
  avatar: text(),
  name: text().notNull(),
  username: text().notNull(),
  headline: text(),
  bio: text(),
  role: roles().default("developer").notNull(),
  stats: jsonb().$type<{
    followers: number;
    following: number;
}>(),
views: jsonb(),
createdAt: timestamp().defaultNow().notNull(),
updatedAt: timestamp().defaultNow().notNull(),
});

export const follows = pgTable("follows", {
  follower_id: uuid().references(() => profiles.profile_id, { onDelete: "cascade" }),
  following_id: uuid().references(() => profiles.profile_id, { onDelete: "cascade" }),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull()
});