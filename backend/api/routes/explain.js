const router = require("express").Router();
const { generateExplanation } = require("../../services/bedrockService");

/*
 SIMPLE TEXT EXPLANATION ONLY
*/
router.post("/", async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        error: "No content provided",
      });
    }

    const explanation = await generateExplanation(content);

    res.json({ explanation });
  } catch (error) {
    console.error("Bedrock error:", error);
    res.status(500).json({
      error: "Bedrock request failed",
    });
  }
});

module.exports = router;