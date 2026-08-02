import { parseInput as parseTextInput } from "../services/parser";

export async function parseInputNode(state: any): Promise<any> {
  const parsedText = await parseTextInput(state.text);
  return {
    ...state,
    text: parsedText,
    processingSteps: [...state.processingSteps, "Parsed input"],
  };
}