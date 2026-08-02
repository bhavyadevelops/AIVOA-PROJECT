import { jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const complaintsTable = pgTable("complaints", {
  id: serial("id").primaryKey(),
  complaint: jsonb("complaint").notNull(),
  riskAssessment: jsonb("risk_assessment").notNull(),
  documentName: text("document_name"),
  documentType: text("document_type"),
  status: text("status").notNull().default("Pending Triage"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});