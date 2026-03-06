require("dotenv").config();

const express = require("express");
const cors = require("cors");

const explainRoutes = require("./api/routes/explain.routes");
const qaRoutes = require("./api/routes/qa.routes");
const uploadRoutes = require("./api/routes/upload.routes");

const app = express();   // ✅ MUST come before app.use()

app.use(cors());
app.use(express.json());

app.use("/api/explain", explainRoutes);
app.use("/api/qa", qaRoutes);
app.use("/api/upload", uploadRoutes); // ✅ now safe

const PORT = process.env.PORT || PORT;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});