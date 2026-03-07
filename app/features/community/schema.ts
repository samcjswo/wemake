import {
  bigint,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  type PgColumn,
} from "drizzle-orm/pg-core";
import { profiles } from "../users/schema";

export const topics = pgTable("community_topics", {
  topic_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  slug: text().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});

export const posts = pgTable("community_posts", {
  post_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  topic_id: bigint({ mode: "number" }).references(() => topics.topic_id, { onDelete: "cascade" }),
  title: text().notNull(),
  content: text().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
  profile_id: uuid().references(() => profiles.profile_id, { onDelete: "cascade" }),
});

export const postUpvotes = pgTable("community_post_upvotes", {
  post_id: bigint({ mode: "number" }).references(() => posts.post_id, { onDelete: "cascade" }),
  profile_id: uuid().references(() => profiles.profile_id, { onDelete: "cascade" }),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
}, (table) => [primaryKey({ columns: [table.post_id, table.profile_id] })]);

export const postReplies = pgTable("community_post_replies", {
  post_reply_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  post_id: bigint({ mode: "number" }).references(() => posts.post_id, { onDelete: "cascade" }),
  parent_reply_id: bigint({ mode: "number" }).references(
    (): PgColumn => postReplies.post_reply_id,
    { onDelete: "cascade" },
  ),
  profile_id: uuid().references(() => profiles.profile_id, { onDelete: "cascade" }),
  reply: text().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});


