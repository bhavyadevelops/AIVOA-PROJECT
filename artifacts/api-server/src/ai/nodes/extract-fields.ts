import { createGroqClient } from "../services/groq";
import { validateComplaintFields } from "../services/validators";
import { EXTRACTION_PROMPT } from "../prompts/extraction";
import { createEmptyComplaintFields } from "@workspace/shared-types";

export async function extractFieldsNode(state: any): Promise<any> {
  const fallback = createEmptyComplaintFields();
  if (!process.env.GROQ_API_KEY) {
    return {
      ...state,
      complaint: { ...fallback, ...state.complaint },
      processingSteps: [...state.processingSteps, "Used fallback extraction"],
    };
  }

  const groq = await createGroqClient();
  const completion = await groq.chat.completions.create({
    model: "gemma2-9b-it",
    temperature: 0,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: EXTRACTION_PROMPT },
      { role: "user", content: state.text },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  const extracted = content ? JSON.parse(content) : {};
  const validatedComplaint = validateComplaintFields(extracted);

  return {
    ...state,
    complaint: { ...fallback, ...state.complaint, ...validatedComplaint },
    processingSteps: [...state.processingSteps, "Extracted complaint fields"],
  };
}