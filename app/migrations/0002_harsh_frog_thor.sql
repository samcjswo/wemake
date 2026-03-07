CREATE TABLE "community_post_replies" (
	"post_reply_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "community_post_replies_post_reply_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"post_id" bigint,
	"parent_reply_id" bigint,
	"profile_id" uuid,
	"reply" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_post_upvotes" (
	"post_id" bigint,
	"profile_id" uuid,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "community_post_upvotes_post_id_profile_id_pk" PRIMARY KEY("post_id","profile_id")
);
--> statement-breakpoint
CREATE TABLE "community_posts" (
	"post_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "community_posts_post_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"topic_id" bigint,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"profile_id" uuid
);
--> statement-breakpoint
CREATE TABLE "community_topics" (
	"topic_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "community_topics_topic_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "community_post_replies" ADD CONSTRAINT "community_post_replies_post_id_community_posts_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."community_posts"("post_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_post_replies" ADD CONSTRAINT "community_post_replies_parent_reply_id_community_post_replies_post_reply_id_fk" FOREIGN KEY ("parent_reply_id") REFERENCES "public"."community_post_replies"("post_reply_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_post_replies" ADD CONSTRAINT "community_post_replies_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_post_upvotes" ADD CONSTRAINT "community_post_upvotes_post_id_community_posts_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."community_posts"("post_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_post_upvotes" ADD CONSTRAINT "community_post_upvotes_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_topic_id_community_topics_topic_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."community_topics"("topic_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;