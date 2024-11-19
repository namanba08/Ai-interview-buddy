import { pgTable, serial, text, varchar, integer } from "drizzle-orm/pg-core";
// AIzaSyBuntOizbibCI1OYL120cFvyGluC1k8Vug
export const MockInterview = pgTable("mockinterviewtool", {
	id: serial("id").primaryKey(),
	jsonMockResp: text("jsonMockResp").notNull(),
	jobPosition: varchar("jobPosition").notNull(),
	jobDesc: varchar("jobDesc").notNull(),
	jobExperience: varchar("jobExperience").notNull(),
	createdBy: varchar("createdBy").notNull(),
	createdAt: varchar("createdAt"),
	mockId: varchar("mockId").notNull(),
	duration: integer("duration"),
	rating: integer("rating"),
});

export const UserAnswer = pgTable("userAnswer", {
	id: serial("id").primaryKey(),
	mockIdRef: varchar("mockId").notNull(),
	question: varchar("question").notNull(),
	correctAns: text("correctAns"),
	userAns: text("userAns"),
	feedback: text("feedback"),
	rating: varchar("rating"),
	userEmail: varchar("userEmail"),
	createdAt: varchar("createdAt"),
});
