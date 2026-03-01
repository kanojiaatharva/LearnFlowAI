const router = require("express").Router();
const { generateExplanation } = require("../services/bedrockService");

router.post("/", async (req, res) => {
  try {
    const { content } = req.body;

    const explanation = await generateExplanation(content);

    res.json({ explanation });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Bedrock request failed",
    });
  }
});

module.exports = router;