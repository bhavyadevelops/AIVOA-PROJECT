import type { ComplaintFields } from "./complaint";
import type { RiskAssessment } from "./risk";

export interface ExtractionResult {
  complaint: ComplaintFields;
  riskAssessment: RiskAssessment;
  missingFields: string[];
  processingStage: string;
}

export interface ComplaintGraphInput {
  text: string;
  documentName?: string;
  documentType?: string;
}
