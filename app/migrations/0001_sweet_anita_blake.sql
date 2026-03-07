DO $$ BEGIN
  CREATE TYPE "public"."role" AS ENUM('developer', 'founder', 'marketer', 'product_manager', 'designer', 'other');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
  CREATE TABLE "ideas" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"like_count" integer DEFAULT 0 NOT NULL,
	"claimed_at" timestamp,
	"claimed_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
  );
EXCEPTION WHEN duplicate_table THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
  CREATE TABLE "gpt_ideas_likes" (
	"idea_id" bigint,
	"profile_id" uuid,
	CONSTRAINT "gpt_ideas_likes_idea_id_profile_id_pk" PRIMARY KEY("idea_id","profile_id")
  );
EXCEPTION WHEN duplicate_table THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
  CREATE TABLE "categories" (
	"category_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "categories_category_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"description" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
  );
EXCEPTION WHEN duplicate_table THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
  CREATE TABLE "product_upvotes" (
	"product_id" bigint,
	"profile_id" uuid,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "product_upvotes_product_id_profile_id_pk" PRIMARY KEY("product_id","profile_id")
  );
EXCEPTION WHEN duplicate_table THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
  CREATE TABLE "products" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "products_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"tagline" text NOT NULL,
	"description" text NOT NULL,
	"how_it_works" text NOT NULL,
	"icon" text NOT NULL,
	"url" text NOT NULL,
	"stats" jsonb DEFAULT '{"views":0,"reviews":0}'::jsonb NOT NULL,
	"profile_id" uuid,
	"category_id" bigint,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
  );
EXCEPTION WHEN duplicate_table THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
  CREATE TABLE "reviews" (
	"review_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "reviews_review_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"product_id" bigint,
	"profile_id" uuid,
	"rating" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "rating_check" CHECK ("reviews"."rating" between 1 and 5)
  );
EXCEPTION WHEN duplicate_table THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
  CREATE TABLE "follows" (
	"follower_id" uuid,
	"following_id" uuid,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
  );
EXCEPTION WHEN duplicate_table THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
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
EXCEPTION WHEN duplicate_table THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "ideas" ADD CONSTRAINT "ideas_claimed_by_profiles_profile_id_fk" FOREIGN KEY ("claimed_by") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "gpt_ideas_likes" ADD CONSTRAINT "gpt_ideas_likes_idea_id_ideas_id_fk" FOREIGN KEY ("idea_id") REFERENCES "public"."ideas"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "gpt_ideas_likes" ADD CONSTRAINT "gpt_ideas_likes_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "product_upvotes" ADD CONSTRAINT "product_upvotes_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "product_upvotes" ADD CONSTRAINT "product_upvotes_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "products" ADD CONSTRAINT "products_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("category_id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "reviews" ADD CONSTRAINT "reviews_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_id_profiles_profile_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "follows" ADD CONSTRAINT "follows_following_id_profiles_profile_id_fk" FOREIGN KEY ("following_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "profiles" ADD CONSTRAINT "profiles_profile_id_users_id_fk" FOREIGN KEY ("profile_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;