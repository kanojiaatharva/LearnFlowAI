const router = require("express").Router();
const upload = require("../../middleware/upload.middleware");
const { analyzePDF } =
  require("../../application/contentAnalyzer/contentAnalyzer.service");
const {
  generateExplanation,
} = require("../../application/explanationGenerator/explanation.service");

router.post("/", async (req, res) => {
  const result = await generateExplanation(req.body.content);
  res.json({ explanation: result });
});

router.post("/upload", upload.single("file"), async (req, res) => {
  const analysis = await analyzePDF(req.file.path);
  const explanation =
    await generateExplanation(analysis.rawText);

  res.json({ explanation });
});

module.exports = router;