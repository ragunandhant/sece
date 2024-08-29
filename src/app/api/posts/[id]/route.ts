import {neon} from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http";

import { comments } from "@/db/schema/comments";
import {  posts } from "@/db/schema/posts";
import { count, desc, eq,sql,AnyColumn  } from "drizzle-orm";
import { NextResponse } from "next/server";



export async function GET(request: Request, { params }: { params: { id: string } }) {
  const token = request.headers.get("Authorization");
  if (token !== `Bearer ${process.env.TOKEN_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const postId = parseInt(params.id);

  try {

    const conn = neon(process.env.DRIZZLE_DATABASE_URL!)
    const db = drizzle(conn)
    const dbPost = await db.select().from(posts).where(eq(posts.id,postId))
    
    if (dbPost.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    const postComments = await db.select().from(comments).where(eq(comments.postId,postId)).orderBy(desc(comments.createdAt));
    return NextResponse.json({...dbPost[0],"comments":postComments}, { status: 200 });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json({ error: "Error fetching post" }, { status: 500 });
  }
}


export const runtime = 'edge';
