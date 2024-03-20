import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations, InferInsertModel, InferSelectModel } from "drizzle-orm";
import { integer } from "drizzle-orm/pg-core";
import { bigserial } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  password: varchar("password", { length: 256 }).notNull(),
  firstName: varchar("first_name", { length: 50 }).default(""),
  lastName: varchar("last_name", { length: 50 }).default(""),
  maidenName: varchar("maiden_name", { length: 50 }).default(""),
  age: integer("age"),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  UpdatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const posts = pgTable(
  "posts",
  {
    id: bigserial("id", { mode: "bigint" }).primaryKey().unique(),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id),
    title: text("title").notNull().unique(),
    slug: text("slug").notNull(),
    description: text("description").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    UpdatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (posts) => ({
    nameIdx: uniqueIndex("slugIdx").on(posts.slug),
  })
);

export const comments = pgTable("comments", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),
  message: text("message").notNull().unique(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  postId: bigserial("post_id", { mode: "bigint" })
    .notNull()
    .references(() => posts.id),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  UpdatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  comments: many(comments),
}));

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
}));

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type Post = InferSelectModel<typeof posts>;
export type NewPost = InferInsertModel<typeof posts>;
export type Comment = InferSelectModel<typeof comments>;
export type NewComment = InferInsertModel<typeof comments>;
