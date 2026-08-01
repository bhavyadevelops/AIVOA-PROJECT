import { Router, type IRouter } from "express";
import { ComplaintCopilotChatBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/copilot/chat", async (req, res): Promise<void> => {
  const parsed = ComplaintCopilotChatBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { complaint, message } = parsed.data;
  const reply = `Based on the active complaint, ${complaint.severity} severity and ${complaint.priority} priority are supported by the recorded ${complaint.complaintType.toLowerCase() || "quality"} concern. ${message.includes("?") ? "Verify the batch, expiry date, quantity, and source evidence before final disposition." : "Please verify the generated fields before saving."}`;
  res.json({ reply });
});

export default router;
