import { parseInputNode } from "./nodes/parse-input";
import { extractFieldsNode } from "./nodes/extract-fields";
import { classifyRiskNode } from "./nodes/classify-risk";
import { summarizeNode } from "./nodes/summarize";
import { completenessNode } from "./nodes/completeness";
import type { ComplaintGraphInput, ComplaintGraphState } from "./state";
import { createEmptyComplaintFields, createEmptyRiskAssessment } from "../../../../shared/types";

export async function buildComplaintGraph(input: ComplaintGraphInput): Promise<ComplaintGraphState> {
  let state: ComplaintGraphState = {
    text: input.text,
    documentName: input.documentName,
    documentType: input.documentType,
    complaint: createEmptyComplaintFields(),
    riskAssessment: createEmptyRiskAssessment(),
    summary: "",
    missingFields: [],
    processingSteps: [],
  };

  state = await parseInputNode(state);
  state = await extractFieldsNode(state);
  state = classifyRiskNode(state);
  state = summarizeNode(state);
  state = completenessNode(state);

  return state;
}
