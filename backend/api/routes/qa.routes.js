const router = require("express").Router();
const { answerQuestion } =
require("../../application/qaHandler/qa.service");

router.post("/", async(req,res)=>{
  const answer =
    await answerQuestion(req.body.question, "");

  res.json({ answer });
});

module.exports = router;