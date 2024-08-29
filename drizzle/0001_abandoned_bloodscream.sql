CREATE TABLE IF NOT EXISTS "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"comments" text,
	"author" text,
	"authorImg" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"likeCount" integer DEFAULT 0,
	"parentId" integer,
	"postId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"content" text,
	"author" text,
	"published_at" date,
	"image" text,
	"upvote" integer DEFAULT 0,
	"downvote" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_postId_posts_id_fk" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
