const router = require("express").Router();

router.post("/", async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        error: "No content provided",
      });
    }

    // Temporary AI logic (we replace with Bedrock later)
    const explanation = `
  Simple Explanation:

This content discusses:
"${content.substring(0, 150)}..."

It will be converted into beginner-friendly explanations
using LearnFlow AI.
`;

    res.json({ explanation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;