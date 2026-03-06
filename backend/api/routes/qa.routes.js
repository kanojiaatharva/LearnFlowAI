const express = require("express");
const router = express.Router();

const { streamChatWithNova } = require("../../services/bedrockService");

router.post("/", async (req, res) => {

  const { sessionId, question } = req.body;

  if (!sessionId || !question) {
    return res.status(400).json({
      error: "sessionId and question required"
    });
  }

  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Transfer-Encoding", "chunked");

  await streamChatWithNova(sessionId, question, res);

});

module.exports = router;