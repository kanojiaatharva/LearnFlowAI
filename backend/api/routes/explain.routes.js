const express = require("express");
const router = express.Router();

const { chatWithNova } = require("../../services/bedrockService");

router.post("/", async (req, res) => {

  try {

    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        error: "Content is required"
      });
    }

    const explanation = await chatWithNova("explain-session", content);

    res.json({
      explanation
    });

  } catch (error) {

    console.error("Explain error:", error);

    res.status(500).json({
      error: "AI explanation failed"
    });

  }

});

module.exports = router;