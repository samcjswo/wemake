import {
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  companyLogoUrl: text("company_logo_url").notNull(),
  title: text("title").notNull(),
  jobType: text("job_type").notNull(),
  positionLocation: text("position_location").notNull(),
  salaryRange: text("salary_range").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  responsibilities: text("responsibilities").array().notNull(),
  requirements: text("requirements").array().notNull(),
  applyUrl: text("apply_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});