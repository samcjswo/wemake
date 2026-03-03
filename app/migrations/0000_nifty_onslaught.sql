CREATE TABLE "jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_name" text NOT NULL,
	"company_logo_url" text NOT NULL,
	"title" text NOT NULL,
	"job_type" text NOT NULL,
	"position_location" text NOT NULL,
	"salary_range" text NOT NULL,
	"location" text NOT NULL,
	"description" text NOT NULL,
	"responsibilities" text[] NOT NULL,
	"requirements" text[] NOT NULL,
	"apply_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
