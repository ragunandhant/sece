import { NextResponse } from "next/server";

import {neon} from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http";

import { comments } from "@/db/schema/comments";
import {  posts } from "@/db/schema/posts";
import { count, desc, eq,sql,AnyColumn  } from "drizzle-orm";

 export async function GET(request: Request) {
    const token = request.headers.get("Authorization");
    if (token !== `Bearer ${process.env.TOKEN_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
   
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = 7;
  
    try {
      type CountResult = {
        count: number;
      }[];
      const conn = neon(process.env.DRIZZLE_DATABASE_URL!)
      const db = drizzle(conn)
    
      const availablePost = await db.select().from(posts).
      orderBy(desc(posts.createdAt)).limit(limit).offset((page - 1) * limit)
      const result:any = []
      for(let i = 0; i < availablePost.length; i++){
        const currentPost = availablePost[i];
        const availableComments = await db.select().from(comments).where(eq(comments.postId,currentPost.id)).orderBy(desc(comments.createdAt));
        result.push({
          ...currentPost,
          comments: availableComments,
          _count: {
            comments: availableComments.length
          }
        })
     
      }

      const totalPosts :CountResult= await db.select({count:count()}).from(posts);
      const hasMore= totalPosts[0].count > page * limit;
      
      return NextResponse.json({
        "posts": result,
        "hasMore": hasMore,
        "totalPosts": totalPosts[0].count,
        "currentPage": page,
      }, { status: 200 });
    } catch (error) {
      console.error("Error fetching posts:", error);
      return NextResponse.json({ error: "Error fetching posts" }, { status: 500 });
    }
  }

export async function POST(request: Request) {
  const token = request.headers.get("Authorization");
  if (token!== `Bearer ${process.env.TOKEN_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  try {
    const conn = neon(process.env.DRIZZLE_DATABASE_URL!)
    const db = drizzle(conn)


    const body = await request.json();
    console.log("parsed body")
    const newPost = await db.insert(posts).values({
        title: body.title,
        content: body.content,
        authorImg : body.authorImg,
        image : body.image,
        author : body.author

    }).returning({ insertedId: posts.id });

  
    console.log("created post", newPost)
    return NextResponse.json(body, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Error creating post" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const token = request.headers.get("Authorization");
  if (token !== `Bearer ${process.env.TOKEN_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, upvote, downvote } = body;
    

    if (!id) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }
    const conn = neon(process.env.DRIZZLE_DATABASE_URL!)
    const db = drizzle(conn)
    let updateSql = null;
    
    

    if (downvote) {
      updateSql =  await db.update(posts).set({
        downvote :sql`${posts.downvote} + 1`
      })
      .where(eq(posts.id, id)).returning({ updatedId: posts.id });
    }

    if (upvote) {
      updateSql =await  db.update(posts).set({
        upvote :sql`${posts.upvote} + 1`
      })
      .where(eq(posts.id, id)).returning({ updatedId: posts.id });
    }
    

    return NextResponse.json(updateSql);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({ error: "Error updating post" }, { status: 500 });
  }
}


export const runtime = 'edge';
