/*
  Warnings:

  - You are about to drop the column `likeCount` on the `Post` table. All the data in the column will be lost.
  - Added the required column `authorImg` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "authorImg" TEXT NOT NULL,
ADD COLUMN     "parentId" INTEGER;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "likeCount",
ADD COLUMN     "authorImg" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "downvote" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "upvote" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
