export function validateComplaintFields(value: any): any {
  const cleaned: any = {};
  for (const [key, entry] of Object.entries(value)) {
    if (typeof entry === "string") {
      cleaned[key] = entry.trim();
    }
  }
  return cleaned;
}