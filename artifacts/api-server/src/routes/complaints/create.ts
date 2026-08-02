import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, complaintsTable } from "@workspace/db";
import { CreateComplaintBody } from "@workspace/api-zod";

const router = Router();

router.post("/complaints", async (req, res): Promise<void> => {
  const parsed = CreateComplaintBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [record] = await db.insert(complaintsTable).values({
    complaint: parsed.data.complaint,
    riskAssessment: parsed.data.riskAssessment,
    documentName: parsed.data.documentName || null,
    documentType: parsed.data.documentType || null,
    status: "Pending Triage",
  }).returning();

  res.status(201).json({
    ...record,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  });
});

export default router;