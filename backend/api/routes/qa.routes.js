const express = require("express");
const router = express.Router();

const { answerQuestion } = require("../../services/aiService");

router.post("/", async (req, res) => {

  try {

    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        error: "Question is required"
      });
    }

    const answer = await answerQuestion(question);

    res.json({
      answer
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "AI answer failed"
    });

  }

});

module.exports = router;