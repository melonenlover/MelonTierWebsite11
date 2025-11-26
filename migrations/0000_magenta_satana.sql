CREATE TABLE "players" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(16) NOT NULL,
	"region" varchar(2) NOT NULL,
	"total_points" integer DEFAULT 0 NOT NULL,
	"combat_title" varchar(50) NOT NULL,
	"avatar_url" text,
	"tiers" jsonb NOT NULL,
	CONSTRAINT "players_username_unique" UNIQUE("username")
);
