CREATE TABLE "teams" (
	"team_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "teams_team_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"product_name" text NOT NULL,
	"team_size" integer NOT NULL,
	"equity_split" integer NOT NULL,
	"roles" text NOT NULL,
	"product_description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "team_size_check" CHECK ("teams"."team_size" between 1 and 100),
	CONSTRAINT "equity_split_check" CHECK ("teams"."equity_split" between 1 and 100)
);
