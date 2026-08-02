import { parseInputNode } from "./nodes/parse-input";
import { extractFieldsNode } from "./nodes/extract-fields";
import { classifyRiskNode } from "./nodes/classify-risk";
import { summarizeNode } from "./nodes/summarize";
import { completenessNode } from "./nodes/completeness";
import { createEmptyComplaintFields, createEmptyRiskAssessment } from "@workspace/shared-types";

export async function buildComplaintGraph(input: any): Promise<any> {
  let state = {
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