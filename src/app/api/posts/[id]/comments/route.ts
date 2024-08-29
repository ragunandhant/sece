import { NextResponse } from "next/server";
import prisma from "../../../../../utils/prisma";

import { drizzle } from "drizzle-orm/neon-http";
import {neon} from "@neondatabase/serverless"
import { comments } from "@/db/schema/comments";
import {  posts } from "@/db/schema/posts";
import { count, desc, eq,sql,AnyColumn  } from "drizzle-orm";


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postId = parseInt(params.id);
    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }
   const conn = neon(process.env.DRIZZLE_DATABASE_URL!)
    const db = drizzle(conn)

    const commentsForPost = await db.select().from(comments).where(eq(comments.postId,postId)).orderBy(desc(comments.createdAt));
 
    

    return NextResponse.json(commentsForPost);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Error fetching comments" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const postId = parseInt(params.id);
    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }
   const conn = neon(process.env.DRIZZLE_DATABASE_URL!)
    const db = drizzle(conn)

    const { content, author, authorImg } = await request.json();
    
    const newComment = await db.insert(comments).values({
      content,
      author,
      authorImg,
      postId,
    })
     return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json({ error: "Error adding comment" }, { status: 500 });
  }
}
export const runtime = 'edge';