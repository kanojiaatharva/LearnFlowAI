const { chatWithNova } = require("./bedrockService");

async function explainContent(content) {

  const prompt = `
Explain the following technical content clearly.

Provide:
1. Simple summary
2. Step-by-step explanation
3. Key concepts

Content:
${content}
`;

  return await chatWithNova("explain-session", prompt);
}

async function answerQuestion(sessionId, question) {

  return await chatWithNova(sessionId, question);

}

module.exports = {
  explainContent,
  answerQuestion
};