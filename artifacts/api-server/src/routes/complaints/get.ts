import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, complaintsTable } from "@workspace/db";
import { GetComplaintParams } from "@workspace/api-zod";

const router = Router();

router.get("/complaints/:id", async (req, res): Promise<void> => {
  const params = GetComplaintParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [record] = await db.select().from(complaintsTable).where(eq(complaintsTable.id, params.data.id));
  if (!record) {
    res.status(404).json({ error: "Complaint not found" });
    return;
  }

  res.json({
    ...record,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  });
});

export default router;