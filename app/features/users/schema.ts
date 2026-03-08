import { bigint, jsonb, pgEnum, pgSchema, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { products } from "../products/schema";
import { posts } from "../community/schema";

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
  updatedAt: timestamp().defaultNow().notNull(),
});

export const typeEnum = pgEnum("type", [
  "follow",
  "review",
  "reply",
  "mention"
]);

export const notifications = pgTable("notifications", {
  notification_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  source_id: uuid().references(() => profiles.profile_id, { onDelete: "cascade" }),
  product_id: bigint({ mode: "number" }).references(() => products.id, { onDelete: "cascade" }),
  post_id: bigint({ mode: "number" }).references(() => posts.post_id, { onDelete: "cascade" }),
  target_id: uuid().references(() => profiles.profile_id, { onDelete: "cascade" }),
  type: text().notNull(),
  created_at: timestamp().defaultNow().notNull(),
});

export const messageRooms = pgTable("message_rooms", {
  "message_room_id": bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  "created_at": timestamp().defaultNow().notNull()
});

export const messageRoomMembers = pgTable("message_room_members", {
  "message_room_id": bigint({ mode: "number" }).references(() => messageRooms.message_room_id, { onDelete: "cascade" }),
  "profile_id": uuid().references(() => profiles.profile_id, { onDelete: "cascade" }),
  "created_at": timestamp().defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  "message_id": bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  "message_room_id": bigint({ mode: "number" }).references(() => messageRooms.message_room_id, { onDelete: "cascade" }),
  "sender_id": uuid().references(() => profiles.profile_id, { onDelete: "cascade" }),
  "content": text().notNull(),
  "seen_at": timestamp(),
  "created_at": timestamp().defaultNow().notNull(),
});