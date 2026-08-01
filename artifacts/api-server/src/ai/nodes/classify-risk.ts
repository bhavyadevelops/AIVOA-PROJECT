import type { ComplaintGraphState } from "../state";
import { createEmptyRiskAssessment } from "../../../../../shared/types";

export function classifyRiskNode(state: ComplaintGraphState): ComplaintGraphState {
  const lower = `${state.complaint.complaintType} ${state.complaint.description}`.toLowerCase();
  const severe = /contamin|foreign particle|adverse|patient/.test(lower);
  const major = /damaged|crack|defect|packag|discolor|out.?of.?spec/.test(lower);
  const riskAssessment = createEmptyRiskAssessment();

  riskAssessment.overallRisk = severe ? "High" : major ? "Medium" : "Low";
  riskAssessment.severityRationale = severe
    ? "Complaint signals a credible potential patient safety impact and requires immediate evaluation."
    : major
      ? "The reported defect could affect product integrity and should be triaged promptly."
      : "Available details indicate a limited quality concern with no stated patient impact.";
  riskAssessment.priorityRationale = severe
    ? "Urgent review is required to protect patients and preserve affected product."
    : major
      ? "High-priority quality review is recommended before further distribution decisions."
      : "Routine quality triage is appropriate with follow-up for missing context.";
  riskAssessment.patientSafetyImpact = severe
    ? "Potential patient safety impact — hold and assess affected material."
    : major
      ? "No confirmed patient harm; product integrity concern requires evaluation."
      : "No patient safety impact identified from the submitted information.";
  riskAssessment.productQualityImpact = severe || major
    ? "Potential impact to product quality and packaging integrity."
    : "Limited product quality impact identified from the submitted information.";
  riskAssessment.recommendedActions = severe
    ? ["Quarantine affected batch immediately", "Escalate to Quality Assurance", "Assess distribution and patient exposure"]
    : major
      ? ["Open quality assessment", "Review batch and packaging records", "Request supporting photographs or samples"]
      : ["Confirm missing complaint details", "Complete routine quality review"];
  riskAssessment.confidenceNotes = "Assessment is generated from the supplied complaint text. Verify all fields and conclusions before disposition.";

  return {
    ...state,
    riskAssessment,
    processingSteps: [...state.processingSteps, "Classified risk"],
  };
}
