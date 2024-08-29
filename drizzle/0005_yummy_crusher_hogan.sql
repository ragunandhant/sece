ALTER TABLE "posts" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN IF EXISTS "updated_at";