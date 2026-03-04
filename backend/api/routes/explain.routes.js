const express = require("express");
const router = express.Router();

const { explainContent } = require("../../services/aiService");

router.post("/", async (req, res) => {

  try {

    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        error: "Content is required"
      });
    }

    const explanation = await explainContent(content);

    res.json({
      explanation
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "AI explanation failed"
    });

  }

});

module.exports = router;