const router = require("express").Router();

router.post("/", async (req, res) => {
  const { content } = req.body;

  // TEMP AI MOCK (we replace with Bedrock next)
  const explanation = `
  Simple Explanation:
  ${content.substring(0, 200)}

  This section explains the core idea in beginner-friendly terms.
  `;

  res.json({ explanation });
});

module.exports = router;