import { Router } from "express";
import { ExtractComplaintBody } from "@workspace/api-zod";
import { buildComplaintGraph } from "../../ai";

const router = Router();

router.post("/extract", async (req, res): Promise<void> => {
  const parsed = ExtractComplaintBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const graph = await buildComplaintGraph({
    text: parsed.data.text,
    documentName: parsed.data.documentName,
    documentType: parsed.data.documentType,
  });

  req.log.info({ documentName: parsed.data.documentName }, "Complaint extraction completed");
  res.json({
    complaint: graph.complaint,
    riskAssessment: graph.riskAssessment,
    missingFields: graph.missingFields,
    processingStage: "Completed",
  });
});

export default router;