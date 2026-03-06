const { generateExplanation } =
require("../explanationGenerator/explanation.service");

async function answerQuestion(question, context) {
  return generateExplanation(
    `Question:${question}\nContext:${context}`
  );
}

module.exports = { answerQuestion };