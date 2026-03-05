const express = require("express");
const router = express.Router();

const { answerQuestion } = require("../../services/aiService");

router.post("/", async (req, res) => {

  try {

    const { sessionId, question } = req.body;

    if (!sessionId || !question) {
      return res.status(400).json({
        error: "sessionId and question required"
      });
    }

    const answer = await answerQuestion(sessionId, question);

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