import { parseInput as parseTextInput } from "../services/parser";
import type { ComplaintGraphState } from "../state";

export async function parseInputNode(state: ComplaintGraphState): Promise<ComplaintGraphState> {
  const parsedText = await parseTextInput(state.text);
  return {
    ...state,
    text: parsedText,
    processingSteps: [...state.processingSteps, "Parsed input"],
  };
}
