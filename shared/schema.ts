import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  initials: text("initials").notNull(),
  role: text("role").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  initials: true,
  role: true,
});

// Subject schema
export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  progress: integer("progress").notNull(),
  color: text("color").notNull(),
  userId: integer("user_id").notNull(),
});

export const insertSubjectSchema = createInsertSchema(subjects).pick({
  name: true,
  progress: true,
  color: true,
  userId: true,
});

// Task schema
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: text("due_date").notNull(),
  priority: text("priority").notNull(),
  completed: boolean("completed").notNull().default(false),
  subjectId: integer("subject_id"),
  userId: integer("user_id").notNull(),
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  title: true,
  description: true,
  dueDate: true,
  priority: true,
  completed: true,
  subjectId: true,
  userId: true,
});

// Study session schema
export const studySessions = pgTable("study_sessions", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(),
  duration: integer("duration").notNull(),
  subjectId: integer("subject_id"),
  userId: integer("user_id").notNull(),
});

export const insertStudySessionSchema = createInsertSchema(studySessions).pick({
  date: true,
  duration: true,
  subjectId: true,
  userId: true,
});

// Note schema
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  date: timestamp("date").notNull(),
  subjectId: integer("subject_id"),
  userId: integer("user_id").notNull(),
});

export const insertNoteSchema = createInsertSchema(notes).pick({
  title: true,
  content: true,
  date: true,
  subjectId: true,
  userId: true,
});

// Goal schema
export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  target: integer("target").notNull(),
  current: integer("current").notNull(),
  unit: text("unit").notNull(),
  userId: integer("user_id").notNull(),
});

export const insertGoalSchema = createInsertSchema(goals).pick({
  title: true,
  target: true,
  current: true,
  unit: true,
  userId: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Subject = typeof subjects.$inferSelect;
export type InsertSubject = z.infer<typeof insertSubjectSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type StudySession = typeof studySessions.$inferSelect;
export type InsertStudySession = z.infer<typeof insertStudySessionSchema>;

export type Note = typeof notes.$inferSelect;
export type InsertNote = z.infer<typeof insertNoteSchema>;

export type Goal = typeof goals.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
