import type { ComplaintGraphState } from "../state";

const REQUIRED_FIELDS = [
  ["customerName", "Customer Name"],
  ["productName", "Product Name"],
  ["batch", "Batch Number"],
  ["expiryDate", "Expiry Date"],
  ["quantity", "Quantity"],
];

export function completenessNode(state: ComplaintGraphState): ComplaintGraphState {
  const missingFields = REQUIRED_FIELDS.filter(([key]) => !state.complaint[key as keyof typeof state.complaint]).map(([, label]) => label);

  return {
    ...state,
    missingFields,
    processingSteps: [...state.processingSteps, "Checked completeness"],
  };
}
