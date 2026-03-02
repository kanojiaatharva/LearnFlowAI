require("dotenv").config();
const express = require("express");
const cors = require("cors");

const explainRoutes = require("./api/routes/explain.routes");
const qaRoutes = require("./api/routes/qa.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/explain", explainRoutes);
app.use("/api/qa", qaRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);