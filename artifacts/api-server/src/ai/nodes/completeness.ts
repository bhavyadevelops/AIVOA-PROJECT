const REQUIRED_FIELDS = [
  ["customerName", "Customer Name"],
  ["productName", "Product Name"],
  ["batch", "Batch Number"],
  ["expiryDate", "Expiry Date"],
  ["quantity", "Quantity"],
];

export function completenessNode(state: any): any {
  const missingFields = REQUIRED_FIELDS.filter(([key]) => !state.complaint[key]).map(([, label]) => label);

  return {
    ...state,
    missingFields,
    processingSteps: [...state.processingSteps, "Checked completeness"],
  };
}