import {
    bigint,
  boolean,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { profiles } from "../users/schema";

export const gptIdeas = pgTable("ideas", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  viewCount: integer("view_count").notNull().default(0),
  likeCount: integer("like_count").notNull().default(0),
  claimed_at: timestamp("claimed_at"),
  claimed_by: uuid("claimed_by").references(() => profiles.profile_id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const gptIdeasLikes = pgTable("gpt_ideas_likes", {
  idea_id: bigint({ mode: "number" }).references(() => gptIdeas.id, { onDelete: "cascade" }),
  profile_id: uuid("profile_id").references(() => profiles.profile_id, { onDelete: "cascade" }),
}, (table) => [primaryKey({ columns: [table.idea_id, table.profile_id] })]);
