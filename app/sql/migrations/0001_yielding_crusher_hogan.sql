CREATE TYPE "public"."role" AS ENUM('developer', 'founder', 'marketer', 'product_manager', 'designer', 'other');--> statement-breakpoint
CREATE TABLE "follows" (
	"follower_id" uuid,
	"following_id" uuid,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"profile_id" uuid PRIMARY KEY NOT NULL,
	"avatar" text,
	"name" text NOT NULL,
	"username" text NOT NULL,
	"headline" text,
	"bio" text,
	"role" "role" DEFAULT 'developer' NOT NULL,
	"stats" jsonb,
	"views" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_id_profiles_profile_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_following_id_profiles_profile_id_fk" FOREIGN KEY ("following_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_profile_id_users_id_fk" FOREIGN KEY ("profile_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;