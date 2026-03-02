const pdfParse = require("pdf-parse");
const fs = require("fs");

async function analyzePDF(path) {
  const buffer = fs.readFileSync(path);
  const data = await pdfParse(buffer);

  return {
    rawText: data.text.substring(0, 4000),
    concepts: extractConcepts(data.text),
  };
}

function extractConcepts(text) {
  return text.split(" ").slice(0, 20);
}

module.exports = { analyzePDF };