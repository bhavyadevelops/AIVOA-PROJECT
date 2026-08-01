export * from "./generated/api";
export type {
  ComplaintFields,
  ComplaintInput,
  ComplaintRecord,
  CopilotMessage,
  CopilotReply,
  ExtractionInput,
  ExtractionResult,
  HealthStatus,
  RiskAssessment,
} from "./generated/api.schemas";
export { setBaseUrl, setAuthTokenGetter } from "./custom-fetch";
export type { AuthTokenGetter } from "./custom-fetch";
