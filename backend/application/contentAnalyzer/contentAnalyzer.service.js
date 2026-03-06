// contentAnalyzer.service.js
const pdfParse = require("pdf-parse");
const fs = require("fs");

async function analyzePDF(path) {
  const buffer = fs.readFileSync(path);
  const data = await pdfParse(buffer);

  return {
    text: data.text.substring(0, 4000)
  };
}

module.exports = { analyzePDF };