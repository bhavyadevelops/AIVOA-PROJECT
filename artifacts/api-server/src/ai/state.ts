import type { ComplaintFields, RiskAssessment } from "../../../../shared/types";

export interface ComplaintGraphState {
  text: string;
  documentName?: string;
  documentType?: string;
  complaint: ComplaintFields;
  riskAssessment: RiskAssessment;
  summary: string;
  missingFields: string[];
  processingSteps: string[];
}

export interface ComplaintGraphInput {
  text: string;
  documentName?: string;
  documentType?: string;
}
