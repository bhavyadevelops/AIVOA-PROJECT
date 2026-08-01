import type { ComplaintFields } from "../../../../../shared/types";

export function validateComplaintFields(value: Partial<ComplaintFields>): Partial<ComplaintFields> {
  const cleaned: Partial<ComplaintFields> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (typeof entry === "string") {
      cleaned[key as keyof ComplaintFields] = entry.trim();
    }
  }
  return cleaned;
}
