import { createGroqClient } from "../services/groq";
import { RISK_PROMPT } from "../prompts/risk";
import { createEmptyRiskAssessment } from "@workspace/shared-types";

export function classifyRiskNode(state: any): any {
  const fallback = createEmptyRiskAssessment();
  if (!process.env.GROQ_API_KEY) {
    return {
      ...state,
      riskAssessment: { ...fallback, ...state.riskAssessment },
      processingSteps: [...state.processingSteps, "Used fallback risk classification"],
    };
  }

  // For now, use a simple heuristic-based classification
  const severity = state.complaint.severity || "Low";
  const priority = state.complaint.priority || "Low";
  
  const riskAssessment = {
    overallRisk: severity === "High" ? "High" : priority === "High" ? "Medium" : "Low",
    severityReason: `Based on reported severity: ${severity}`,
    priorityReason: `Based on reported priority: ${priority}`,
    patientSafety: severity === "High" ? "Potential impact" : "Minimal impact",
    productQuality: "Under investigation",
    recommendedActions: severity === "High" ? ["Immediate review", "Document findings"] : ["Standard review"],
    confidenceNotes: "Classification based on extracted field values",
  };

  return {
    ...state,
    riskAssessment: { ...fallback, ...state.riskAssessment, ...riskAssessment },
    processingSteps: [...state.processingSteps, "Classified risk"],
  };
}