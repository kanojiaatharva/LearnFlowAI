const { callLLM } = require("../../ai/bedrock.client");
const { fallbackLLM } = require("../../ai/fallback.client");

const useBedrock = process.env.USE_BEDROCK === "true";

async function generateExplanation(content, skill = "beginner") {
  const prompt = `
Explain the following for a ${skill} developer.
Provide:
- simplified explanation
- step-by-step breakdown
- example

${content}
`;

  return useBedrock
    ? await callLLM(prompt)
    : await fallbackLLM(content);
}

module.exports = { generateExplanation };