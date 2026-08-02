export interface RiskAssessment {
  overallRisk: string;
  severityReason: string;
  priorityReason: string;
  patientSafety: string;
  productQuality: string;
  recommendedActions: string[];
  confidenceNotes: string;
}

export function createEmptyRiskAssessment(): RiskAssessment {
  return {
    overallRisk: "Low",
    severityReason: "",
    priorityReason: "",
    patientSafety: "",
    productQuality: "",
    recommendedActions: [],
    confidenceNotes: "",
  };
}