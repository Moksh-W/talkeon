
import {pgTable, uuid, text, timestamp, uniqueIndex, integer} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerkId").unique().notNull(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [uniqueIndex("clerk_id_idx").on(t.clerkId)]);

export const courseTable = pgTable("courses", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerkId").notNull(),
  courseName: text("courseName"),
  unit: integer("unit"),
  lesson: integer("lesson"),
  currentUnit: integer("currentUnit"),
  currentLesson: integer("currentLesson"),
  currency: integer("currency"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),

})

export const questions = pgTable("questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseName: text("courseName"),
  unit: integer("unit"),
  lesson: integer("lesson"),
  type: text("type"),
  question: text("question"),
  answer: text("answer"),
  specialCase: text("specialCase"),
  questionIdx: integer("questionIdx"),
  section:  text("section"),
})

export const lessons = pgTable("lessons", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseName: text("courseName"),
  unit: integer("unit"),
  lesson: integer("lesson"),
  type: text("type"),
  content: text("content"),
})