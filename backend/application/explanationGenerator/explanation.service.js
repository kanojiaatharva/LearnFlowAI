const { callLLM } = require("../../ai/bedrock.client");
const { fallbackLLM } = require("../../ai/fallback.client");

const useBedrock = process.env.USE_BEDROCK === "true";

async function generateExplanation(content, skill="beginner") {

  const prompt = `
Explain for a ${skill} developer.
Provide summary + steps.

${content}
`;

  return useBedrock
    ? await callLLM(prompt)
    : await fallbackLLM(content);
}

module.exports = { generateExplanation };