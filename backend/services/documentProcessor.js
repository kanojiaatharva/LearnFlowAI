const pdf = require("pdf-parse");
const fs = require("fs");

const { generateEmbedding } = require("./embeddingService");
const { storeVector } = require("./vectorStore");

async function processPDF(filePath) {

  const data = await pdf(fs.readFileSync(filePath));

  const text = data.text;

  const chunks = text.match(/(.|[\r\n]){1,500}/g);

  for (const chunk of chunks) {

    const embedding = await generateEmbedding(chunk);

    storeVector(chunk, embedding);

  }

}

module.exports = { processPDF };