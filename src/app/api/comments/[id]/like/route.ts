// app/api/comments/[id]/like/route.ts

import { NextResponse } from "next/server";
import prisma from "../../../../../utils/prisma";


import { drizzle } from "drizzle-orm/neon-http";
import {neon} from "@neondatabase/serverless"
import { comments } from "@/db/schema/comments";
import {  posts as Posts } from "@/db/schema/posts";
import { count, desc, eq,sql,AnyColumn  } from "drizzle-orm";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const commentId = parseInt(params.id);
    if (isNaN(commentId)) {
      return NextResponse.json({ error: "Invalid comment ID" }, { status: 400 });
    }

    const conn = neon(process.env.DRIZZLE_DATABASE_URL!)
    const db = drizzle(conn)

    const updatedComment = await db.update(comments).set({
      likeCount: sql`${comments.likeCount} + 1`
    }).where(eq(comments.id, commentId)).returning({ "likeCount" : comments.likeCount});


    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error("Error liking comment:", error);
    return NextResponse.json({ error: "Error liking comment" }, { status: 500 });
  }
}
export const runtime = 'edge';