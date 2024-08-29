import { date, pgTable, serial, text,integer, timestamp } from "drizzle-orm/pg-core";


export const posts = pgTable("posts", {

    id: serial('id').notNull().primaryKey(),
    title: text('title'),
    content: text('content'),
    publishedAt: date('published_at'),
    authorImg: text('authorImg'),
    image : text('image'),
    upvote : integer('upvote').default(0),
    downvote : integer('downvote').default(0),
    createdAt : timestamp('createdAt').notNull().defaultNow(),
    author : text('author')

})

