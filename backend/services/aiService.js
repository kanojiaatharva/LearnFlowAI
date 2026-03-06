const { chatWithNova } = require("./bedrockService");
const { generateEmbedding } = require("./embeddingService");
const { searchSimilar } = require("./vectorStore");

async function answerQuestion(sessionId, question) {

  const queryEmbedding = await generateEmbedding(question);

  const docs = searchSimilar(queryEmbedding);

  const context = docs.map(d => d.text).join("\n");

  const prompt = `
Use the following document context to answer the question.

Context:
${context}

Question:
${question}
`;

  return await chatWithNova(sessionId, prompt);

}

module.exports = {
  answerQuestion
};