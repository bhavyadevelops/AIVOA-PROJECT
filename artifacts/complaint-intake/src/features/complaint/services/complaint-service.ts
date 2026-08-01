import type { ComplaintFields, RiskAssessment } from '@workspace/api-client-react';

export function buildAiPopulationMap(complaint: Partial<ComplaintFields>) {
  const populated = new Set<keyof ComplaintFields>();
  (Object.keys(complaint) as Array<keyof ComplaintFields>).forEach((key) => {
    if (complaint[key]) {
      populated.add(key);
    }
  });
  return populated;
}

export function validateRequiredComplaintFields(complaint: Partial<ComplaintFields>) {
  return Boolean(complaint.customerName && complaint.productName);
}
