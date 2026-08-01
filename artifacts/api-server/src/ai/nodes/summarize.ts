import type { ComplaintGraphState } from "../state";

export function summarizeNode(state: ComplaintGraphState): ComplaintGraphState {
  const summary = [
    state.complaint.complaintType || "Complaint",
    state.complaint.productName || "product",
    state.riskAssessment.overallRisk || "Low",
  ].join(" - ");

  return {
    ...state,
    summary,
    processingSteps: [...state.processingSteps, "Generated summary"],
  };
}
