export function summarizeNode(state: any): any {
  const summary = `Complaint regarding ${state.complaint.productName || "unknown product"} (${state.complaint.strength || "unknown strength"}). Reported by ${state.complaint.customerName || "unknown customer"}. ${state.complaint.description || "No description provided."}`;
  
  return {
    ...state,
    summary,
    processingSteps: [...state.processingSteps, "Generated summary"],
  };
}