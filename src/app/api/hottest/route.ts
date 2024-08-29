import { NextResponse } from "next/server";
import prisma from "@/utils/prisma"

import { drizzle } from "drizzle-orm/neon-http";
import {neon} from "@neondatabase/serverless"
import { comments } from "@/db/schema/comments";
import {  posts as Posts } from "@/db/schema/posts";
import { count, desc, eq,sql,AnyColumn  } from "drizzle-orm";
// export const runtime = 'edge';

// export async function GET() {
//   try {
//     const posts = await prisma.post.findMany({
//       include: {
//         comments: {
//           include: {
//             replies: true
//           }
//         },
//         _count: {
//           select: { comments: true }
//         }
//       },
//       orderBy: {
//         createdAt: 'desc'
//       }
//     });
  
//     const popularityScores = posts.map(post => {
//       // Count votes (1 point each)
//       const voteScore = post.upvote + post.downvote;

//       // Count comments and replies (2 points each)
//       const commentScore = post._count.comments * 2;
//       const replyScore = post.comments.reduce((sum, comment) => sum + comment.replies.length * 2, 0);

//       // Calculate total popularity score
//       const popularityScore = voteScore + commentScore + replyScore;

//       return {
//         ...post,
//         popularityScore
//       };
//     });

//     // Sort posts by popularity score in descending order
//     const sortedPosts = popularityScores.sort((a, b) => b.popularityScore - a.popularityScore);

//     // Get top 5 popular posts
//     const top5Posts = sortedPosts.slice(0, 5);

//     return NextResponse.json(top5Posts, { status: 200 });
//   } catch (error) {
//     console.error('Error fetching popular posts:', error);
//     return NextResponse.json({ error: 'An error occurred while fetching popular posts' }, { status: 500 });
//   }
// }

export async function GET(request: Request) {

 try {
  const conn = neon(process.env.DRIZZLE_DATABASE_URL!)
  const db = drizzle(conn)
  const query = `
  WITH comment_count AS (
    SELECT posts.id as "postId", COUNT(comments.id) as count
    FROM posts 
    LEFT JOIN comments ON posts.id = comments."postId"
    GROUP BY posts.id
)
SELECT posts.*, 
       (comment_count.count * 2 + posts.upvote + posts.downvote) as "popularityScore",
       comment_count.count as "_count",
       (
           SELECT json_agg(c.*) 
           FROM comments c 
           WHERE c."postId" = posts.id
       ) as "comments"
FROM posts
JOIN comment_count ON posts.id = comment_count."postId"
ORDER BY "popularityScore" desc
LIMIT 5;

  `;

   const popularPost = await db.execute(sql.raw(query))
   return NextResponse.json(popularPost.rows, { status: 200 });


 } catch (error) {
  console.error('Error fetching popular posts:', error);
  return NextResponse.json({ error: 'An error occurred while fetching popular posts' }, { status: 500 });
 }

}

