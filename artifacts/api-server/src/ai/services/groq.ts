export async function createGroqClient() {
  const { default: Groq } = await import("groq-sdk");
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
}
