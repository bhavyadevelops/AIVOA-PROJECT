export interface RiskAssessment {
  overallRisk: string;
  severityRationale: string;
  priorityRationale: string;
  patientSafetyImpact: string;
  productQualityImpact: string;
  recommendedActions: string[];
  confidenceNotes: string;
  explanation?: string[];
  completenessWarnings?: string[];
}

export function createEmptyRiskAssessment(): RiskAssessment {
  return {
    overallRisk: "Low",
    severityRationale: "",
    priorityRationale: "",
    patientSafetyImpact: "",
    productQualityImpact: "",
    recommendedActions: [],
    confidenceNotes: "",
    explanation: [],
    completenessWarnings: [],
  };
}
