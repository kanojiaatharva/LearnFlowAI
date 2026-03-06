const express = require("express");
const router = express.Router();

const multer = require("multer");
const { processPDF } = require("../../services/documentProcessor");

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {

  try {

    await processPDF(req.file.path);

    res.json({
      message: "Document processed successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Document processing failed"
    });

  }

});

module.exports = router;