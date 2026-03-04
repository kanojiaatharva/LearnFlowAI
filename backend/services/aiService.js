const { generateExplanation } = require("./bedrockService");

async function explainContent(content) {

  const prompt = `
You are an AI learning assistant.

Explain the following technical content clearly.

Provide:
1. Simple summary
2. Step-by-step explanation
3. Key concepts

Content:
${content}
`;

  return await generateExplanation(prompt);
}

async function answerQuestion(question) {

  const prompt = `
Answer the following technical question clearly and concisely.

Question:
${question}
`;

  return await generateExplanation(prompt);
}

module.exports = {
  explainContent,
  answerQuestion
};