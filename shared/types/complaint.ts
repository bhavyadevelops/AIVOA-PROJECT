export interface ComplaintFields {
  complaintSource: string;
  customerName: string;
  productName: string;
  strength: string;
  batch: string;
  manufacturingDate: string;
  expiryDate: string;
  quantity: string;
  complaintType: string;
  complaintDate: string;
  description: string;
  severity: string;
  priority: string;
}

export function createEmptyComplaintFields(): ComplaintFields {
  return {
    complaintSource: "",
    customerName: "",
    productName: "",
    strength: "",
    batch: "",
    manufacturingDate: "",
    expiryDate: "",
    quantity: "",
    complaintType: "",
    complaintDate: "",
    description: "",
    severity: "",
    priority: "",
  };
}