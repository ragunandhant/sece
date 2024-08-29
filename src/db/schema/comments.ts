import { serial, text, pgTable, pgSchema, timestamp, integer } from "drizzle-orm/pg-core";
import { posts } from "./posts";

export const comments = pgTable("comments", {
    id:serial('id').notNull().primaryKey(),
    content : text('comments'),
    author : text('author'),
    authorImg : text('authorImg'),
    createdAt : timestamp('created_at').notNull().defaultNow(),
    likeCount : integer('likeCount').default(0),
    parentId : integer('parentId'),
    postId : integer('postId').references(()=>posts.id)
    


})